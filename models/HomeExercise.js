const mongoose = require("mongoose");
const autoIncreament = require("mongoose-auto-increment");

//Init auto increament
autoIncreament.initialize(mongoose.connection);

const HomeExerciseSchema = new mongoose.Schema({
  categoryId: { type: Number, ref: "HomeExercisesCategory", default: 1 },
  title: String,
  description: String,
  images: [String],
  createDate: {
    type: Date,
    default: Date.now(),
  },
});

HomeExerciseSchema.plugin(autoIncreament.plugin, {
  model: "HomeExercise",
  startAt: 1,
});

module.exports = mongoose.model(
  "HomeExercise",
  HomeExerciseSchema,
  "HomeExercises"
);
