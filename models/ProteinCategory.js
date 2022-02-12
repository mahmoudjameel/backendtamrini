const mongoose = require("mongoose");
const autoIncreament = require("mongoose-auto-increment");

//Init auto increament
autoIncreament.initialize(mongoose.connection);

const ProteinCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  image: String,
  createDate: {
    type: Date,
    default: Date.now(),
  },
});

ProteinCategorySchema.plugin(
  autoIncreament.plugin,
  { model: "ProteinCategory", startAt: 1 }
);

module.exports = mongoose.model(
  "ProteinCategory",
  ProteinCategorySchema,
  "ProteinCategories"
);
