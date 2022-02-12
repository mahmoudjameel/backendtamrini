const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const videoExercisesCategory = require("../../models/VideoExercisesCategory");
const validation = require("../../validation/videoExerciseCategories");

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

    let { name, image } = validateProduct;

    //Save the image
    const mainImageUniqueName = `${uuidv4()}.${image.name
      .split(".")
      .pop()}`;

    // check if product-categories folder dosen't exists
    var fs = require("fs");
    var dir = path.join(__dirname, "..", "..", "images", "video-exercise-categories");

    // if not create one
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    // then move the image to the created folder
    await image.mv(
      path.join(
        __dirname,
        "..",
        "..",
        "images",
        "video-exercise-categories",
        mainImageUniqueName
      )
    );

    /********************************************************/

    //Save the product to DB
    const saveProduct = await videoExercisesCategory.create({
      name,
      image: mainImageUniqueName
    });

    if (!saveProduct) {
      return res.json({
        status: false,
        errors: ["حدث خطأ غير متوقع ، يرجي المحاولة فيما بعد"]
      });
    }

    /********************************************************/

    saveProduct.image = `${req.protocol}://${req.headers.host}/images/video-exercise-categories/${saveProduct.image}`;

    //Send the success response
    return res.json({
      status: true,
      messages: ["تم اضافة القسم بنجاح"],
      product: saveProduct
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /videoExercisesCategory/add, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message]
    });
  }
});

module.exports = router;
