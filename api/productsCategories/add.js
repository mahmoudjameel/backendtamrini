const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const ProductCategory = require("../../models/ProductCategory");
const validation = require("../../validation/productCategories");

router.post("/", async (req, res) => {
  try {
    const product = req.body;

    //Check for permissions
    if (!(req.user && req.user.role === "admin")) {
      return res.json({
        status: false,
        errors: ["ليس لديك صلاحية الوصول الي هذه البيانات"]
      });
    }

    //Validation
    const validateProduct = await validation({ ...product, files: req.files });
    if (!validateProduct.status) {
      return res.json(validateProduct);
    }
    /********************************************************/

    let { title, mainImage } = validateProduct;

    //Save the image
    const mainImageUniqueName = `${uuidv4()}.${mainImage.name
      .split(".")
      .pop()}`;

    // check if product-categories folder dosen't exists
    var fs = require("fs");
    var dir = path.join(__dirname, "..", "..", "images", "product-categories");

    // if not create one
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    // then move the image to the created folder
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

    /********************************************************/

    //Save the product to DB
    const saveProduct = await ProductCategory.create({
      title,
      mainImage: mainImageUniqueName
    });

    if (!saveProduct) {
      return res.json({
        status: false,
        errors: ["حدث خطأ غير متوقع ، يرجي المحاولة فيما بعد"]
      });
    }

    /********************************************************/

    saveProduct.mainImage = `${req.protocol}://${req.headers.host}/images/product-categories/${saveProduct.mainImage}`;

    //Send the success response
    return res.json({
      status: true,
      messages: ["تم اضافة القسم بنجاح"],
      product: saveProduct
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /product-categories/add, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message]
    });
  }
});

module.exports = router;
