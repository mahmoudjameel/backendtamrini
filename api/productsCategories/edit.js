const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const ProductCategoryModel = require("../../models/ProductCategory");
const validation = require("../../validation/productCategories");

router.post("/", async (req, res) => {
  try {
    const product = req.body;

    //Validation
    const validateProduct = await validation({ ...product, files: req.files, edit: true });
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
    let productSearch = await ProductCategoryModel.findOne({ _id: product._id });

    if (!productSearch) {
      return res.json({
        status: false,
        errors: ["هذا القسم غير موجودة في قاعدة البيانات"],
      });
    }
    /********************************************************/

    let { title, mainImage } = validateProduct;

    /********************************************************/
    //Check if image is not changed
    if (mainImage) {
      //Save the new image
      const mainImageUniqueName = `${uuidv4()}.${mainImage.name
        .split(".")
        .pop()}`;
      await mainImage.mv(
        path.join(
          __dirname,
          "..",
          "..",
          "images",
          "product-categories",
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
          "product-categories",
          productSearch.mainImage
        )
      )
        ? fs.unlinkSync(
          path.join(
            __dirname,
            "..",
            "..",
            "images",
            "product-categories",
            productSearch.mainImage
          )
        )
        : null;

      /********************************************************/
      //Edit the product on DB
      const result = await ProductCategoryModel.updateOne(
        { _id: product._id },
        {
          title,
          mainImage: mainImageUniqueName,
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
      const result = await ProductCategoryModel.updateOne(
        { _id: product._id },
        {
          title
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
    productSearch = await ProductCategoryModel.findOne({ _id: product._id });
    productSearch.mainImage = `${req.protocol}://${req.headers.host}/images/product-categories/${productSearch.mainImage}`

    /********************************************************/
    //Send the success response
    return res.json({
      status: true,
      messages: ["تم تعديل القسم بنجاح"],
      product: productSearch,
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /product-categories/edit, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
