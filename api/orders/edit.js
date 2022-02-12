const express = require("express");
const router = express.Router();
// const fs = require("fs");
// const { v4: uuidv4 } = require("uuid");
// const path = require("path");
const OrderModel = require("../../models/Order");
const PaymentMethodModel = require("../../models/PaymentMethod");
const UserModel = require("../../models/User");
const ProductModel = require("../../models/Product");
// const validation = require("../../validation/order");

router.post("/", async (req, res) => {
  try {
    const { statusId, _id } = req.body;

    // const product = req.body;

    // //Validation
    // const validateOrder = await validation({ ...product, files: req.files });
    // if (!validateOrder.status) {
    //   return res.json(validateOrder);
    // }

    // /********************************************************/
    // //Validate _id
    // if (!product._id) {
    //   return res.json({
    //     status: false,
    //     errors: ["هذا الطلب غير موجود بقاعدة البيانات"],
    //   });
    // }
    if (![1, 2, 3].includes(Number(statusId))) {
        return res.json({
        status: false,
        errors: ["هناك خطأ في حالة الطلب"],
      });
    }

    /********************************************************/
    //Check if product exist on DB
    let orderSearch = await OrderModel.findOne({ _id: _id });

    if (!orderSearch) {
      return res.json({
        status: false,
        errors: ["هذا الطلب غير موجودة في قاعدة البيانات"],
      });
    }
    /********************************************************/

    // let { productId, paymentMethodId, userId, statusId, paymentImage } = validateOrder;

    /********************************************************/
    //Check if image is not changed
    // if (paymentImage.name !== orderSearch.paymentImage) {
    //   //Save the new image
    //   const paymentImageUniqueName = `${uuidv4()}.${paymentImage.name
    //     .split(".")
    //     .pop()}`;
    //   await paymentImage.mv(
    //     path.join(
    //       __dirname,
    //       "..",
    //       "..",
    //       "images",
    //       "orders",
    //       paymentImageUniqueName
    //     )
    //   );

    //   //delete the old image
    //   fs.existsSync(
    //     path.join(
    //       __dirname,
    //       "..",
    //       "..",
    //       "images",
    //       "orders",
    //       orderSearch.paymentImage
    //     )
    //   )
    //     ? fs.unlinkSync(
    //         path.join(
    //           __dirname,
    //           "..",
    //           "..",
    //           "images",
    //           "orders",
    //           orderSearch.paymentImage
    //         )
    //       )
    //     : null;

      /********************************************************/
      //Edit the product on DB
      const result = await OrderModel.updateOne(
        { _id: _id },
        {
          statusId
        }
      );
      // const result = await OrderModel.updateOne(
      //   { _id: product._id },
      //   {
      //     productId,
      //     paymentMethodId,
      //     userId,
      //     statusId,
      //     paymentImage: paymentImageUniqueName,
      //   }
      // );

      if (result.nModified === 0) {
        return res.json({
          status: false,
          errors: ["لم تقم بإجراء أي تغيير"],
        });
      }
    // } else {
    //   //Edit the product on DB
    //   const result = await OrderModel.updateOne(
    //     { _id: product._id },
    //     {
    //       productId,
    //       paymentMethodId,
    //       userId,
    //       statusId,
    //     }
    //   );

    //   if (result.nModified === 0) {
    //     return res.json({
    //       status: false,
    //       errors: ["لم تقم بإجراء أي تغيير"],
    //     });
    //   }
    // }

    /********************************************************/
    //Get the new product
    orderSearch = await OrderModel.findOne({ _id: _id });
    orderSearch.paymentImage = orderSearch.paymentImage ? `${req.protocol}://${req.headers.host}/images/orders/${orderSearch.paymentImage}` : "";
    await PaymentMethodModel.populate(orderSearch, {path: "paymentMethodId"})
    await UserModel.populate(orderSearch, {path: "userId"})
    await ProductModel.populate(orderSearch, {path: "productId"})
    /********************************************************/
    //Send the success response
    return res.json({
      status: true,
      messages: ["تم تعديل الطلب بنجاح"],
      order: orderSearch,
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /orders/edit, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
