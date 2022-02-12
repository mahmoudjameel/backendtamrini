const express = require("express");
const router = express.Router();
const PaymentMethodModel = require("../../models/PaymentMethod");

router.post("/", async (req, res) => {
  try {
    const paymentMethod = req.body;
    let errors = [];

    //Validation
    if (!paymentMethod.name) errors.push("يجب وضع اسم لوسيلة الدفع");
    if (!paymentMethod.description)
      errors.push("يجب كتابة خطوات وتفاصيل طريقة الدفع لكي يراها العميل");

    if (errors.length !== 0) {
      return res.json({
        status: false,
        errors,
      });
    }

    /********************************************************/
    //Check if paymentMethod exist on DB
    let paymentMethodSearch = await PaymentMethodModel.findOne({
      _id: paymentMethod._id,
    });

    if (!paymentMethodSearch) {
      return res.json({
        status: false,
        errors: ["وسيلة الدفع هذه غير موجودة في قاعدة البيانات"],
      });
    }

    /********************************************************/
    //Edit the paymentMethod on DB
    const result = await PaymentMethodModel.updateOne(
      { _id: paymentMethod._id },
      {
        name: paymentMethod.name,
        description: paymentMethod.description,
      }
    );

    if (result.nModified === 0) {
      return res.json({
        status: false,
        errors: ["لم تقم بإجراء أي تغيير"],
      });
    }

    /********************************************************/
    //Get the new paymentMethod
    paymentMethodSearch = await PaymentMethodModel.findOne({
      _id: paymentMethod._id,
    });

    /********************************************************/
    //Send the success response
    return res.json({
      status: true,
      messages: ["تم تعديل وسيلة الدفع بنجاح"],
      paymentMethod: paymentMethodSearch,
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /paymentMethods/edit, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
