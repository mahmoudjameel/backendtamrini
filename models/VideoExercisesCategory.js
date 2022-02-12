const mongoose = require("mongoose");
const autoIncreament = require("mongoose-auto-increment");

//Init auto increament
autoIncreament.initialize(mongoose.connection);

const VideoExercisesCategorySchema = new mongoose.Schema({
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

VideoExercisesCategorySchema.plugin(autoIncreament.plugin, {
  model: "VideoExercisesCategory",
  startAt: 1,
});

module.exports = mongoose.model(
  "VideoExercisesCategory",
  VideoExercisesCategorySchema,
  "videoExercisesCategories"
);
