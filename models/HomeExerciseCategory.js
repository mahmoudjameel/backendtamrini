const mongoose = require("mongoose");
const autoIncreament = require("mongoose-auto-increment");

//Init auto increament
autoIncreament.initialize(mongoose.connection);

const HomeExercisesCategorySchema = new mongoose.Schema({
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

HomeExercisesCategorySchema.plugin(autoIncreament.plugin, {
  model: "HomeExercisesCategory",
  startAt: 1,
});

module.exports = mongoose.model(
  "HomeExercisesCategory",
  HomeExercisesCategorySchema,
  "HomeExercisesCategories"
);
