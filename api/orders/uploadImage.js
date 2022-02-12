const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const OrderModel = require("../../models/Order");
const validation = require("../../validation/paymentImage");
const { saveImage } = require("../../helpers/saveImage");

router.post("/", async (req, res) => {
  try {
    const order = req.body;

    //Check for permissions
    if (!req.user) {
      return res.json({
        status: false,
        errors: ["يجب عليك تسجيل الدخول لكي تتمكن من اضافة طلب جديد"],
      });
    }

    //Validation
    const validateOrder = await validation({ ...order, files: req.files });
    if (!validateOrder.status) {
      return res.json(validateOrder);
    }

    /********************************************************/

    let { orderID, paymentImage } = validateOrder;

    let paymentImageUniqueName = "";
    //Save the image
    if (paymentImage) {
      const paymentImageBase = paymentImage.split(";base64,").pop();
      const paymentImageBuffer = Buffer.from(paymentImageBase, "base64");
      const imageResponse = await saveImage(
        paymentImageBuffer,
        "images/orders/",
        uuidv4()
      );
      if (typeof imageResponse === "object" && imageResponse !== null) {
        return imageResponse;
      }
      paymentImageUniqueName = imageResponse;
    }

    /********************************************************/

    //Save the product to DB
    const saveOrder = await OrderModel.findById(orderID);

    if (!saveOrder) {
      return res.json({
        status: false,
        errors: ["حدث خطأ غير متوقع ، يرجي المحاولة فيما بعد"],
      });
    }

    saveOrder.paymentImage = paymentImageUniqueName;
    saveOrder.save();

    //Send the success response
    return res.json({
      status: true,
      messages: ["تم اضافة صورة الدفع بنجاح"],
      order: saveOrder,
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /orders/add, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
