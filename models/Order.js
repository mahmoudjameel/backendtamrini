const mongoose = require("mongoose");
const autoIncreament = require("mongoose-auto-increment");

//Init auto increament
autoIncreament.initialize(mongoose.connection);

const OrderSchema = new mongoose.Schema({
  userId: {
    type: Number,
    ref: "users",
    required: true,
  },
  productId: {
    type: Number,
    ref: "products",
    required: true,
  },
  paymentMethodId: {
    type: Number,
    ref: "PaymentMethods",
    required: true,
  },
  address: String,
  tel: String,
  statusId: {
    type: Number,
    default: 1,
    //1 =>لم يتم الدفع
    //2 => تم الدفع
    //3 => ملغي
  },
  paymentImage: String,
  createDate: {
    type: Date,
    default: Date.now(),
  },
});

OrderSchema.plugin(autoIncreament.plugin, { model: "Order", startAt: 1 });

module.exports = mongoose.model("Order", OrderSchema, "orders");
