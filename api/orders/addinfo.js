const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const OrderModel = require("../../models/Order");
const validation = require("../../validation/paymentImage");

router.post("/", async (req, res) => {
  try {
    const { orderId, address, tel } = req.body;

    //Check for permissions
    if (!req.user) {
      return res.json({
        status: false,
        errors: ["يجب عليك تسجيل الدخول لكي تتمكن من اضافة طلب جديد"],
      });
    }

    /********************************************************/

    if (!address) {
      return {
        status: false,
        errors: ["يجب كتابة  العنوان "],
      };
    }

    if (!tel) {
      return {
        status: false,
        errors: ["يجب كتابة  رقم الهاتف "],
      };
    }

    if (!orderId) {
      return {
        status: false,
        errors: ["حدتث مشكلة اثناء تحديد الطلب الخاص بك"],
      };
    }

    const saveOrder = await OrderModel.findById(orderId);

    /********************************************************/

    if (!saveOrder) {
      return res.json({
        status: false,
        errors: ["حدث خطأ غير متوقع ، يرجي المحاولة فيما بعد"],
      });
    }

    saveOrder.address = address;
    saveOrder.tel = tel;
    saveOrder.save();

    //Send the success response
    return res.json({
      status: true,
      messages: ["تم اضافة صورة الدفع بنجاح"],
      order: saveOrder,
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /orders/addinfo, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
