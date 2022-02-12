const mongoose = require("mongoose");
const autoIncreament = require("mongoose-auto-increment");

//Init auto increament
autoIncreament.initialize(mongoose.connection);

const PaymentMethodSchema = new mongoose.Schema({
  name: String,
  description: String,
  createDate: {
    type: Date,
    default: Date.now(),
  },
});

PaymentMethodSchema.plugin(autoIncreament.plugin, {
  model: "PaymentMethod",
  startAt: 1,
});

module.exports = mongoose.model(
  "PaymentMethod",
  PaymentMethodSchema,
  "paymentMethods"
);
