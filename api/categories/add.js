const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const ImageCategoryModel = require("../../models/ImageExercisesCategory");
const VideoCategoryModel = require("../../models/VideoExercisesCategory");
const validation = require("../../validation/category");

router.post("/", async (req, res) => {
  try {
    //Validation
    let validateCategory = await validation({ ...req.body, files: req.files });
    if (!validateCategory.status) return res.json(validateCategory);

    let type = +req.body.type;

    if (!type || ![1, 2].includes(type)) {
      return res.json({
        status: false,
        errors: ["يجب تحديد نوع القسم"],
      });
    }

    /***********************************************/

    let { name, image } = validateCategory;

    //Check if name exist
    let categorySearch =
      type === 1
        ? await ImageCategoryModel.findOne({ name })
        : type === 2
        ? await VideoCategoryModel.findOne({ name })
        : null;

    if (categorySearch) {
      return res.json({
        status: false,
        errors: ["لقد قمت بإضافة هذا الاسم من قبل"],
      });
    }
    /***********************************************/
    // check if categories folder dosen't exists
    var fs = require("fs");
    var dir = path.join(__dirname, "..", "..", "images", "categories");

    // if not create one
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    //Save the image
    const imageUniqueName = `${uuidv4()}.${image.name.split(".").pop()}`;
    await image.mv(
      path.join(__dirname, "..", "..", "images", "categories", imageUniqueName)
    );

    let categorySave =
      type === 1
        ? await ImageCategoryModel.create({ name, image: imageUniqueName })
        : type === 2
        ? await VideoCategoryModel.create({ name, image: imageUniqueName })
        : null;

    if (!categorySave) {
      return res.json({
        status: false,
        errors: ["حدثت مشكلة أثناء حفظ القسم"],
      });
    }

    return res.json({
      status: true,
      messages: ["تمت اضافة القسم بنجاح"],
      category: categorySave,
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /users/login, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
