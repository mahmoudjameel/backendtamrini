const mongoose = require("mongoose");
const autoIncreament = require("mongoose-auto-increment");
const { stringify } = require("uuid");

//Init auto increament
autoIncreament.initialize(mongoose.connection);

const BarCodeSchema = new mongoose.Schema({
  name: String,
  code: String,
  type: String,
  protein: Number,
  fat: Number,
  energy: Number,
  carbs: Number,
  weight: Number,
  mainImage: [String],
  createDate: {
    type: Date,
    default: Date.now(),
  },
});

BarCodeSchema.plugin(autoIncreament.plugin, {
  model: "BarCode",
  startAt: 1,
});

module.exports = mongoose.model("BarCode", BarCodeSchema, "barcodes");
