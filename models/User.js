const mongoose = require("mongoose");
const autoIncreament = require("mongoose-auto-increment");

//Init auto increament
autoIncreament.initialize(mongoose.connection);

const UserSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  phoneNumber: String,
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  favoriteArticles: {
    type: [Number],
    required: false,
    defautlt: [],
    ref: "articles"
  },
  favoriteImageExercices: {
    type: [Number],
    required: false,
    defautlt: [],
    ref: "imageExercises"
  },
  favoriteVideoExercices: {
    type: [Number],
    required: false,
    defautlt: [],
    ref: "videoExercises"
  },
  createDate: {
    type: Date,
    default: Date.now(),
  }
});

UserSchema.plugin(autoIncreament.plugin, { model: "User", startAt: 1 });

module.exports = mongoose.model("User", UserSchema, "users");
