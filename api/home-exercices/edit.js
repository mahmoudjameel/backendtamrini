const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const ImageExerciseCategoryModel = require("../../models/HomeExerciseCategory");
const validation = require("../../validation/homeExerciseCategory");

router.post("/", async (req, res) => {
  try {
    const product = req.body;

    //Validation
    const validateProduct = await validation({
      ...product,
      files: req.files,
      edit: true,
    });
    if (!validateProduct.status) {
      return res.json(validateProduct);
    }

    /********************************************************/
    //Validate _id
    if (!product._id) {
      return res.json({
        status: false,
        errors: ["هذا القسم غير موجود بقاعدة البيانات"],
      });
    }

    /********************************************************/
    //Check if product exist on DB
    let productSearch = await ImageExerciseCategoryModel.findOne({
      _id: product._id,
    });

    if (!productSearch) {
      return res.json({
        status: false,
        errors: ["هذا القسم غير موجودة في قاعدة البيانات"],
      });
    }
    /********************************************************/

    let { name, image } = validateProduct;

    /********************************************************/
    //Check if image is not changed
    if (image) {
      //Save the new image
      const mainImageUniqueName = `${uuidv4()}.${image.name.split(".").pop()}`;
      await image.mv(
        path.join(
          __dirname,
          "..",
          "..",
          "images",
          "home-exercise-categories",
          mainImageUniqueName
        )
      );

      //delete the old image
      fs.existsSync(
        path.join(
          __dirname,
          "..",
          "..",
          "images",
          "home-exercise-categories",
          productSearch.image
        )
      )
        ? fs.unlinkSync(
            path.join(
              __dirname,
              "..",
              "..",
              "images",
              "home-exercise-categories",
              productSearch.image
            )
          )
        : null;

      /********************************************************/
      //Edit the product on DB
      const result = await ImageExerciseCategoryModel.updateOne(
        { _id: product._id },
        {
          name,
          image: mainImageUniqueName,
        }
      );

      if (result.nModified === 0) {
        return res.json({
          status: false,
          errors: ["لم تقم بإجراء أي تغيير"],
        });
      }
    } else {
      //Edit the product on DB
      const result = await ImageExerciseCategoryModel.updateOne(
        { _id: product._id },
        {
          name,
        }
      );

      if (result.nModified === 0) {
        return res.json({
          status: false,
          errors: ["لم تقم بإجراء أي تغيير"],
        });
      }
    }

    /********************************************************/
    //Get the new product
    productSearch = await ImageExerciseCategoryModel.findOne({
      _id: product._id,
    });
    productSearch.image = `${req.protocol}://${req.headers.host}/images/home-exercise-categories/${productSearch.image}`;

    /********************************************************/
    //Send the success response
    return res.json({
      status: true,
      messages: ["تم تعديل القسم بنجاح"],
      product: productSearch,
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /HomeExercisesCategory/edit, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
