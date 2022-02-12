const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const DietModel = require("../../models/Diet");
const validation = require("../../validation/diet");

router.post("/", async (req, res) => {
  try {
    let diet = req.body;
    console.log(diet);

    //Check for permissions
    if (!(req.user && req.user.role === "admin")) {
      return res.json({
        status: false,
        errors: ["ليس لديك صلاحية الوصول الي هذه البيانات"],
      });
    }

    //Validation

    const validateDiet = await validation({
      ...diet,
      files: req.files,
    });
    if (!validateDiet.status) {
      return res.json(validateDiet);
    }

    /********************************************************/

    let { name, ingredients, foodValue, preparation, images } = validateDiet;

    let imagesToSave = [];
    // check if halls folder dosen't exists
    var fs = require("fs");
    var dir = path.join(__dirname, "..", "..", "images", "diets");

    // if not create one
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    //Save the images
    for (let image of images) {
      const imageUniqueName = `${uuidv4()}.${image.name.split(".").pop()}`;
      await image.mv(
        path.join(__dirname, "..", "..", "images", "diets", imageUniqueName)
      );

      imagesToSave.push(imageUniqueName);
    }

    /********************************************************/

    //Save the article to DB
    const saveDiet = await DietModel.create({
      name,
      ingredients,
      foodValue,
      preparation,
      images: images.length != 0 ? imagesToSave : ["404.png"],
    });

    if (!saveDiet) {
      return res.json({
        status: false,
        errors: ["حدث خطأ غير متوقع ، يرجي المحاولة فيما بعد"],
      });
    }

    /********************************************************/

    //Edit the images to be urls
    let finalImages = [];

    for (image of saveDiet.images) {
      finalImages.push(
        `${req.protocol}://${req.headers.host}/images/diets/${image}`
      );
    }
    saveDiet.images = finalImages;

    //Send the success response
    return res.json({
      status: true,
      messages: ["تم اضافة الاكلة بنجاح"],
      hall: saveDiet,
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /diets/add, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
