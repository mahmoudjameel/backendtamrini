const express = require("express");
const router = express.Router();
const PaymentMethodModel = require("../../models/PaymentMethod");

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
        errors: ["يجب تحديد وسيلة الدفع الذي تريد حذفها"],
      });

    //Check if article exist or not
    let paymentMethodSearch = await PaymentMethodModel.findOne({
      _id: req.body._id,
    });
    if (!paymentMethodSearch)
      return res.json({
        status: false,
        errors: ["وسيلة الدفع هذه غير موجودة بقاعدة البيانات"],
      });

    let result = await PaymentMethodModel.deleteOne({ _id: req.body._id });

    if (result.deleteCount === 0)
      return res.json({
        status: false,
        errors: ["حدث خطأ ما أثناء حذف وسيلة الدفع"],
      });

    return res.json({
      status: true,
      messages: [`تم حذف وسيلة الدفع رقم ${req.body._id} بنجاح`],
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /paymentMethods/delete, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
