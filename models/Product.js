const mongoose = require("mongoose");
const autoIncreament = require("mongoose-auto-increment");

//Init auto increament
autoIncreament.initialize(mongoose.connection);

const ProductSchema = new mongoose.Schema({
  title: String,
  price: String,
  description: String,
  coachBrief: String,
  mainImage: String,
  categoryId: { type: Number, ref: "products_categories", required: true },
  createDate: {
    type: Date,
    default: Date.now(),
  },
});

ProductSchema.plugin(autoIncreament.plugin, { model: "Product", startAt: 1 });

module.exports = mongoose.model("Product", ProductSchema, "products");
