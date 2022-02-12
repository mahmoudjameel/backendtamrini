const express = require("express");
const router = express.Router();
const ImageExerciseCategoryModel = require("../../models/ImageExercisesCategory");

router.post("/", async (req, res) => {
  try {
    let products = [];
    if (req.body._id) {
      let productSearch = await ImageExerciseCategoryModel.findOne({ _id: req.body._id });

      if (!productSearch) {
        return res.json({
          status: false,
          errors: ["هذا القسم غير مسجل في قاعدة البيانات"],
        });
      }

      products = [...products, productSearch.toObject()];
    } else {
      let productsSearch = await ImageExerciseCategoryModel.find({});

      if (productsSearch.length === 0) {
        return res.json({
          status: false,
          errors: ["لا يوجد أقسام لعرضها"],
        });
      }

      products = [...products, ...productsSearch];
    }

    /********************************************************/
    //Edit the image to be url
    products.map((product) => {
      product.image = `${req.protocol}://${req.headers.host}/images/image-exercise-categories/${product.image}`;
    });

    return res.json({
      status: true,
      products,
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /product-categories/get, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
