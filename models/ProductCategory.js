const mongoose = require("mongoose");
const autoIncreament = require("mongoose-auto-increment");

//Init auto increament
autoIncreament.initialize(mongoose.connection);

const ProductCategorySchema = new mongoose.Schema({
  title: String,
  mainImage: String,
  createDate: {
    type: Date,
    default: Date.now(),
  },
});

ProductCategorySchema.plugin(autoIncreament.plugin, { model: "ProductCategory", startAt: 1 });

module.exports = mongoose.model("ProductCategory", ProductCategorySchema, "products_categories");
