const mongoose = require("mongoose");
const autoIncreament = require("mongoose-auto-increment");

//Init auto increament
autoIncreament.initialize(mongoose.connection);

const ImageExerciseSchema = new mongoose.Schema({
  categoryId: { type: Number, ref: "ImageExercisesCategory", default: 1 },
  title: String,
  description: String,
  images: [String],
  createDate: {
    type: Date,
    default: Date.now(),
  },
});

ImageExerciseSchema.plugin(autoIncreament.plugin, {
  model: "ImageExercise",
  startAt: 1,
});

module.exports = mongoose.model(
  "ImageExercise",
  ImageExerciseSchema,
  "imageExercises"
);
