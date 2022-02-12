const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const ProductModel = require("../../models/ProductCategory");
const Product = require("../../models/Product");

router.post("/", async (req, res) => {
  try {
    //Check for permissions
    if (!(req.user && req.user.role === "admin")) {
      return res.json({
        status: false,
        errors: ["ليس لديك صلاحية الوصول الي هذه البيانات"],
      });
    }

    //If id is empty
    if (!req.body._id)
      return res.json({
        status: false,
        errors: ["يجب تحديد القسم الذي تريد حذفه"],
      });

    //Check if article exist or not
    let productSearch = await ProductModel.findOne({ _id: req.body._id });
    if (!productSearch)
      return res.json({
        status: false,
        errors: ["هذا القسم غير موجود بقاعدة البيانات"],
      });
    let products = await Product.find({categoryId: Number(req.body._id)});
    if(products.length > 0) {
      return res.json({
        status: false,
        errors: ["هذا القسم لديه منتجات بداخله"],
      });
    }

    let result = await ProductModel.deleteOne({ _id: req.body._id });

    if (result.deleteCount === 0)
      return res.json({
        status: false,
        errors: ["حدث خطأ ما أثناء حذف المنتج"],
      });

    //delete the  image
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

    return res.json({
      status: true,
      messages: [`تم حذف القسم رقم ${req.body._id} بنجاح`],
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /product-categories/delete, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
