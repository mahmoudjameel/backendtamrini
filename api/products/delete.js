const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const ProductModel = require("../../models/Product");
const OrderModel = require("../../models/Order");

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
        errors: ["يجب تحديد المنتج الذي تريد حذفه"],
      });

    //Check if article exist or not
    let productSearch = await ProductModel.findOne({ _id: req.body._id });
    if (!productSearch)
      return res.json({
        status: false,
        errors: ["هذا المنتج غير موجود بقاعدة البيانات"],
      });

    let ordersSearch = await OrderModel.find({ productId: productSearch._id });
    if (ordersSearch.length > 0)
      return res.json({
        status: false,
        errors: ["لا يمكن حذف هذا المنتج, لديه طلبات مسبقا"],
      });

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
        "products",
        productSearch.mainImage
      )
    )
      ? fs.unlinkSync(
          path.join(
            __dirname,
            "..",
            "..",
            "images",
            "products",
            productSearch.mainImage
          )
        )
      : null;

    return res.json({
      status: true,
      messages: [`تم حذف المنتج رقم ${req.body._id} بنجاح`],
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /products/delete, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
