const mongoose = require("mongoose");
const autoIncreament = require("mongoose-auto-increment");

//Init auto increament
autoIncreament.initialize(mongoose.connection);
const QuestionSchema = new mongoose.Schema({
  user: {
    type: Number,
    ref: "users",
    required: true,
  },
  question: String,
  time: {
    type: Date,
    default: Date.now,
  },
  answers: [
    {
      user: {
        type: Number,
        ref: "users",
        required: true,
      },
      answer: String,
      time: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  likes: {
    type: [Number],
    required: false,
    defautlt: [],
    ref: "users",
  },
});

QuestionSchema.plugin(autoIncreament.plugin, { model: "Question", startAt: 1 });

module.exports = mongoose.model("Question", QuestionSchema, "questions");
