const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Token = new Schema({
  tokenValue: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Token", Token);
