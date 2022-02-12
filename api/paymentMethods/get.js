const express = require("express");
const router = express.Router();
const PaymentMethodModel = require("../../models/PaymentMethod");

router.post("/", async (req, res) => {
  try {
    let paymentMethods = [];
    if (req.body._id) {
      let paymentMethodSearch = await PaymentMethodModel.findOne({
        _id: req.body._id,
      });

      if (!paymentMethodSearch) {
        return res.json({
          status: false,
          errors: ["هذا المنتج غير مسجلة في قاعدة البيانات"],
        });
      }

      paymentMethods = [...paymentMethods, paymentMethodSearch.toObject()];
    } else {
      let paymentMethodsSearch = await PaymentMethodModel.find({});

      if (paymentMethodsSearch.length === 0) {
        return res.json({
          status: false,
          errors: ["لا يوجد وسائل دفع لعرضها"],
        });
      }

      paymentMethods = [...paymentMethods, ...paymentMethodsSearch];
    }

    return res.json({
      status: true,
      paymentMethods,
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /paymentMethods/get, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
