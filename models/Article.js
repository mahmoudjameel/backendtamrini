const mongoose = require("mongoose");
const autoIncreament = require("mongoose-auto-increment");

//Init auto increament
autoIncreament.initialize(mongoose.connection);

const ArticleSchema = new mongoose.Schema({
  title: String,
  content: String,
  mainImage: [String],
  createDate: {
    type: Date,
    default: Date.now(),
  },
});

ArticleSchema.plugin(autoIncreament.plugin, { model: "Article", startAt: 1 });

module.exports = mongoose.model("Article", ArticleSchema, "articles");
