const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
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
        errors: ["يجب تحديد الطلب الذي تريد حذفه"],
      });

    //Check if article exist or not
    let orderSearch = await OrderModel.findOne({ _id: req.body._id });
    if (!orderSearch)
      return res.json({
        status: false,
        errors: ["هذا الطلب غير موجود بقاعدة البيانات"],
      });

    let result = await OrderModel.deleteOne({ _id: req.body._id });

    if (result.deleteCount === 0)
      return res.json({
        status: false,
        errors: ["حدث خطأ ما أثناء حذف الطلب"],
      });

    //delete the  image
    fs.existsSync(
      path.join(
        __dirname,
        "..",
        "..",
        "images",
        "orders",
        orderSearch.paymentImage
      )
    )
      ? fs.unlinkSync(
          path.join(
            __dirname,
            "..",
            "..",
            "images",
            "orders",
            orderSearch.paymentImage
          )
        )
      : null;

    return res.json({
      status: true,
      messages: [`تم حذف الطلب رقم ${req.body._id} بنجاح`],
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /orders/delete, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
