const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const HallModel = require("../../models/Hall");
const validation = require("../../validation/hall");

router.post("/", async (req, res) => {
  try {
    const hall = req.body;

    //Validation
    const validateHall = await validation({ ...hall, files: req.files });
    if (!validateHall.status) {
      return res.json(validateHall);
    }

    /********************************************************/
    //Validate _id
    if (!hall._id) {
      return res.json({
        status: false,
        errors: ["يجب تحديد القاعة التي تريد تعديلها"],
      });
    }

    /********************************************************/
    //Check if hall exist on DB
    let hallSearch = await HallModel.findOne({ _id: hall._id });

    if (!hallSearch) {
      return res.json({
        status: false,
        errors: ["هذه المقالة غير موجودة في قاعدة البيانات"],
      });
    }
    /********************************************************/

    let { name, city, brief, subscriptions, location, images } = validateHall;

    /********************************************************/
    //Check if images are not changed
    let imagesToSave = [];
    for (let image of images) {
      if (hallSearch.images.indexOf(image.name) === -1) {
        //Save the new image
        const imageUniqueName = `${uuidv4()}.${image.name.split(".").pop()}`;
        await image.mv(
          path.join(__dirname, "..", "..", "images", "halls", imageUniqueName)
        );

        //delete the old image
        fs.existsSync(
          path.join(
            __dirname,
            "..",
            "..",
            "images",
            "halls",
            hallSearch.images[images.indexOf(image)]
          )
        )
          ? fs.unlinkSync(
              path.join(
                __dirname,
                "..",
                "..",
                "images",
                "halls",
                hallSearch.images[images.indexOf(image)]
              )
            )
          : null;

        imagesToSave.push(imageUniqueName);
      } else {
        imagesToSave.push(image.name);
      }
    }
    /********************************************************/
    //Edit the hall on DB
    const result = await HallModel.updateOne(
      { _id: hall._id },
      {
        name,
        city,
        brief,
        subscriptions,
        location,
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
    //Get the new hall
    hallSearch = await HallModel.findOne({ _id: hall._id });

    /********************************************************/
    //Send the success response
    return res.json({
      status: true,
      messages: ["تم تعديل القاعة بنجاح"],
      hall: hallSearch,
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /halls/edit, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
