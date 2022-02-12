const express = require("express");
const router = express.Router();
const OrderModel = require("../../models/Order");
const PaymentMethodModel = require("../../models/PaymentMethod");
const UserModel = require("../../models/User");
const ProductModel = require("../../models/Product");

router.post("/", async (req, res) => {
  try {
    let orders = [];

    //Check for permissions
    if (!req.user) {
      return res.json({
        status: false,
        errors: ["ليس لديك صلاحية الوصول الي هذه البيانات"],
      });
    }

    if (req.body._id && req.user.role === "admin") {
      let orderSearch = await OrderModel.findOne({ _id: req.body._id });

      if (!orderSearch) {
        return res.json({
          status: false,
          errors: ["هذا الطلب غير مسجل في قاعدة البيانات"],
        });
      }

      orders = [...orders, orderSearch.toObject()];
    } else if (req.user.role === "user") {
      if (req.body._id) {
        let orderSearch = await OrderModel.findOne({
          _id: req.body._id,
          userId: req.user._id,
        });

        if (!orderSearch) {
          return res.json({
            status: false,
            errors: ["حدثت مشكلة ويبدو أننا غير قادرين علي عرض هذا الطلب"],
          });
        }

        orders = [...orders, orderSearch.toObject()];
      } else {
        orders = await OrderModel.find({
          userId: req.user._id,
        });
      }
    } else {
      //Check for permissions
      if (req.user.role !== "admin") {
        return res.json({
          status: false,
          errors: ["ليس لديك صلاحية الوصول الي هذه البيانات2"],
        });
      }

      let ordersSearch = await OrderModel.find({});

      if (ordersSearch.length === 0) {
        return res.json({
          status: false,
          errors: ["لا يوجد طلبات لعرضها"],
        });
      }

      orders = [...orders, ...ordersSearch];
    }

    /********************************************************/
    //Edit the image to be url
    orders.map((order) => {
      if (order.paymentImage) {
        order.paymentImage = `${req.protocol}://${req.headers.host}/images/orders/${order.paymentImage}`;
      } else {
        delete order.paymentImage;
      }
    });
    await PaymentMethodModel.populate(orders, { path: "paymentMethodId" });
    await UserModel.populate(orders, { path: "userId" });
    await ProductModel.populate(orders, { path: "productId" });
    orders.map((order) => {
      if (order.productId.mainImage) {
        order.productId.mainImage = `${req.protocol}://${req.headers.host}/images/products/${order.productId.mainImage}`;
      }
    });

    return res.json({
      status: true,
      orders,
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /orders/get, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
