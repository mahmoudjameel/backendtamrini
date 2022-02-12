const express = require("express");
const router = express.Router();
const PaymentMethodModel = require("../../models/PaymentMethod");

router.post("/", async (req, res) => {
  try {
    const paymentMethod = req.body;
    let errors = [];

    //Check for permissions
    if (!(req.user && req.user.role === "admin")) {
      return res.json({
        status: false,
        errors: ["ليس لديك صلاحية الوصول الي هذه البيانات"],
      });
    }

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

    //Save the payment method to DB
    const savePaymentMethod = await PaymentMethodModel.create({
      name: paymentMethod.name,
      description: paymentMethod.description,
    });

    if (!savePaymentMethod) {
      return res.json({
        status: false,
        errors: ["حدث خطأ غير متوقع ، يرجي المحاولة فيما بعد"],
      });
    }

    /********************************************************/

    //Send the success response
    return res.json({
      status: true,
      messages: ["تم اضافة وسيلة الدفع بنجاح"],
      paymentMethod: savePaymentMethod,
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /paymentMethods/add, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
