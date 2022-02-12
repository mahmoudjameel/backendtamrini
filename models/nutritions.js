const mongoose = require("mongoose");
const autoIncreament = require("mongoose-auto-increment");

//Init auto increament
autoIncreament.initialize(mongoose.connection);

const NutritionMethodSchema = new mongoose.Schema({
  name: String,
  protein: Number,
  fat: Number,
  energy: Number,
  carbs: Number,
  createDate: {
    type: Date,
    default: Date.now(),
  },
});

NutritionMethodSchema.plugin(autoIncreament.plugin, {
  model: "Nutrition",
  startAt: 1,
});

module.exports = mongoose.model(
  "Nutrition",
  NutritionMethodSchema,
  "nutritions"
);
