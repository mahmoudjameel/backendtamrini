const mongoose = require("mongoose");
const autoIncreament = require("mongoose-auto-increment");

//Init auto increament
autoIncreament.initialize(mongoose.connection);

const DietSchema = new mongoose.Schema({
  name: String,
  ingredients: String,
  foodValue: String,
  images: [String],
  preparation: String,
  createDate: {
    type: Date,
    default: Date.now(),
  },
});

DietSchema.plugin(autoIncreament.plugin, { model: "Diet", startAt: 1 });

module.exports = mongoose.model("Diet", DietSchema, "Diets");
