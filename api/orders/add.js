const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const OrderModel = require("../../models/Order");
const validation = require("../../validation/order");
const { saveImage } = require("../../helpers/saveImage");
const PaymentMethodModel = require("../../models/PaymentMethod");
const UserModel = require("../../models/User");
const ProductModel = require("../../models/Product");

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

    let { productId, paymentMethodId, userId, paymentImage } = validateOrder;

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
      if(typeof imageResponse === 'object' && imageResponse !== null) {
        return imageResponse;
      }
      paymentImageUniqueName = imageResponse;
      // paymentImageUniqueName = `${uuidv4()}.${paymentImage.name
      //   .split(".")
      //   .pop()}`;
      // await paymentImage.mv(
      //   path.join(
      //     __dirname,
      //     "..",
      //     "..",
      //     "images",
      //     "orders",
      //     paymentImageUniqueName
      //   )
      // );
    }

    /********************************************************/

    //Save the product to DB
    const saveOrder = await OrderModel.create({
      userId,
      productId,
      paymentMethodId,
      paymentImage: paymentImageUniqueName,
    });

    if (!saveOrder) {
      return res.json({
        status: false,
        errors: ["حدث خطأ غير متوقع ، يرجي المحاولة فيما بعد"],
      });
    }

    await PaymentMethodModel.populate(saveOrder, {path: "paymentMethodId"})
    await UserModel.populate(saveOrder, {path: "userId"})
    await ProductModel.populate(saveOrder, {path: "productId"})

    /********************************************************/

    //Send the success response
    return res.json({
      status: true,
      messages: ["تم اضافة طلبك بنجاح"],
      product: saveOrder,
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
