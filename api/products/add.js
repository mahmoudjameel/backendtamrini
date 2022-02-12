const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const ProductModel = require("../../models/Product");
const ProductCategoryModel = require("../../models/ProductCategory");
const validation = require("../../validation/product");

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

    let { title, description, price, coachBrief, mainImage, categoryId } = validateProduct;
    //Save the image
    const mainImageUniqueName = `${uuidv4()}.${mainImage.name
      .split(".")
      .pop()}`;

    // check if products folder dosen't exists
    var fs = require("fs");
    var dir = path.join(__dirname, "..", "..", "images", "products");

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
        "products",
        mainImageUniqueName
      )
    );

    /********************************************************/

    //Save the product to DB
    const saveProduct = await ProductModel.create({
      title,
      description,
      price,
      // coachBrief,
      mainImage: mainImageUniqueName,
      categoryId
    });

    if (!saveProduct) {
      return res.json({
        status: false,
        errors: ["حدث خطأ غير متوقع ، يرجي المحاولة فيما بعد"]
      });
    }

    /********************************************************/

    saveProduct.mainImage = `${req.protocol}://${req.headers.host}/images/products/${saveProduct.mainImage}`;
    await ProductCategoryModel.populate(saveProduct, { path: "categoryId" });
    //Send the success response
    return res.json({
      status: true,
      messages: ["تم اضافة المنتج بنجاح"],
      product: saveProduct
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /products/add, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message]
    });
  }
});

module.exports = router;
