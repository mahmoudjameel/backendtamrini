const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const DietModel = require("../../models/Diet");
const validation = require("../../validation/diet");

router.post("/", async (req, res) => {
  try {
    const diet = req.body;

    //Validation
    const validateDiet = await validation({ ...diet, files: req.files });
    if (!validateDiet.status) {
      return res.json(validateDiet);
    }

    /********************************************************/
    //Validate _id
    if (!diet._id) {
      return res.json({
        status: false,
        errors: ["يجب تحديد الاكلة التي تريد تعديلها"],
      });
    }

    /********************************************************/
    //Check if diet exist on DB
    let dietSearch = await DietModel.findOne({ _id: diet._id });

    if (!dietSearch) {
      return res.json({
        status: false,
        errors: ["هذه الاكلة غير موجودة في قاعدة البيانات"],
      });
    }
    /********************************************************/

    let { name, ingredients, foodValue, preparation, images } = validateDiet;

    /********************************************************/
    //Check if images are not changed
    let imagesToSave = [];
    for (let image of images) {
      if (dietSearch.images.indexOf(image.name) === -1) {
        //Save the new image
        const imageUniqueName = `${uuidv4()}.${image.name.split(".").pop()}`;
        await image.mv(
          path.join(__dirname, "..", "..", "images", "diets", imageUniqueName)
        );

        //delete the old image
        fs.existsSync(
          path.join(
            __dirname,
            "..",
            "..",
            "images",
            "diets",
            dietSearch.images[images.indexOf(image)]
          )
        )
          ? fs.unlinkSync(
              path.join(
                __dirname,
                "..",
                "..",
                "images",
                "diets",
                dietSearch.images[images.indexOf(image)]
              )
            )
          : null;

        imagesToSave.push(imageUniqueName);
      } else {
        imagesToSave.push(image.name);
      }
    }
    /********************************************************/
    //Edit the diet on DB
    const result = await DietModel.updateOne(
      { _id: diet._id },
      {
        name,
        ingredients,
        foodValue,
        preparation,
        images: imagesToSave,
      }
    );

    if (result.nModified === 0) {
      return res.json({
        status: false,
        errors: ["لم تقم بإجراء أي تغيير"],
      });
    }

    /********************************************************/
    //Get the new diet
    dietSearch = await DietModel.findOne({ _id: diet._id });

    /********************************************************/
    //Send the success response
    return res.json({
      status: true,
      messages: ["تم تعديل الاكلة بنجاح"],
      diet: dietSearch,
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /diets/edit, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
