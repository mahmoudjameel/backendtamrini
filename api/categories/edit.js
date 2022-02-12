const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const ImageCategoryModel = require("../../models/ImageExercisesCategory");
const VideoCategoryModel = require("../../models/VideoExercisesCategory");
const validation = require("../../validation/category");

router.post("/", async (req, res) => {
  try {
    const category = req.body;
    let type = +req.body.type;

    //Validation
    const validateCategory = await validation({
      ...category,
      files: req.files,
    });
    if (!validateCategory.status) {
      return res.json(validateCategory);
    }

    /********************************************************/
    //Validate _id
    if (!category._id) {
      return res.json({
        status: false,
        errors: ["رقم القسم غير موجود ؟"],
      });
    }

    //Validate type
    if (!type || ![1, 2].includes(type)) {
      return res.json({
        status: false,
        errors: ["يجب تحديد نوع القسم"],
      });
    }

    /********************************************************/
    //Check if category exist on DB
    let categorySearch =
      type === 1
        ? await ImageCategoryModel.findOne({ _id: category._id })
        : type === 2
        ? await VideoCategoryModel.findOne({ _id: category._id })
        : null;

    if (!categorySearch) {
      return res.json({
        status: false,
        errors: ["هذا القسم غير موجود في قاعدة البيانات"],
      });
    }

    /********************************************************/

    let { name, image } = validateCategory;

    /********************************************************/
    //Check if name exist before
    let nameSearch =
      type === 1
        ? await ImageCategoryModel.findOne({ name, _id: { $ne: category._id } })
        : type === 2
        ? await VideoCategoryModel.findOne({ name, _id: { $ne: category._id } })
        : null;

    if (nameSearch) {
      return res.json({
        status: false,
        errors: ["لقد قمت بإضافة هذا الاسم من قبل"],
      });
    }

    /********************************************************/
    //Check if image is not changed
    if (image.name !== categorySearch.image) {
      //Save the new image
      const imageUniqueName = `${uuidv4()}.${image.name.split(".").pop()}`;
      await image.mv(
        path.join(
          __dirname,
          "..",
          "..",
          "images",
          "categories",
          imageUniqueName
        )
      );

      //delete the old image
      fs.existsSync(
        path.join(
          __dirname,
          "..",
          "..",
          "images",
          "categories",
          categorySearch.image
        )
      )
        ? fs.unlinkSync(
            path.join(
              __dirname,
              "..",
              "..",
              "images",
              "categories",
              categorySearch.image
            )
          )
        : null;

      /********************************************************/
      //Edit the category on DB
      const result =
        type === 1
          ? await ImageCategoryModel.updateOne(
              { _id: category._id },
              {
                name,
                image: imageUniqueName,
              }
            )
          : type === 2
          ? await VideoCategoryModel.updateOne(
              { _id: category._id },
              {
                name,
                image: imageUniqueName,
              }
            )
          : null;

      if (result.nModified === 0) {
        return res.json({
          status: false,
          errors: ["لم تقم بإجراء أي تغيير"],
        });
      }
    } else {
      //Edit the category on DB
      const result =
        type === 1
          ? await ImageCategoryModel.updateOne(
              { _id: category._id },
              {
                name,
              }
            )
          : type === 2
          ? await VideoCategoryModel.updateOne(
              { _id: category._id },
              {
                name,
              }
            )
          : null;

      if (result.nModified === 0) {
        return res.json({
          status: false,
          errors: ["لم تقم بإجراء أي تغيير"],
        });
      }
    }

    /********************************************************/
    //Get the new category
    categorySearch =
      type === 1
        ? await ImageCategoryModel.findOne({ _id: category._id })
        : type === 2
        ? await VideoCategoryModel.findOne({ _id: category._id })
        : null;

    /********************************************************/
    //Send the success response
    return res.json({
      status: true,
      messages: ["تم تعديل القسم بنجاح"],
      category: categorySearch,
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /categories/edit, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
