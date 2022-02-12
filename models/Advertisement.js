const mongoose = require("mongoose");
const autoIncreament = require("mongoose-auto-increment");

//Init auto increament
autoIncreament.initialize(mongoose.connection);

const AdvertisementSchema = new mongoose.Schema({
  image: String,
  link: String,
  createDate: {
    type: Date,
    default: Date.now(),
  }
});

AdvertisementSchema.plugin(autoIncreament.plugin, { model: "Advertisement", startAt: 1 });

module.exports = mongoose.model("Advertisement", AdvertisementSchema, "advertisements");
