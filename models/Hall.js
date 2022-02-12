const mongoose = require("mongoose");
const autoIncreament = require("mongoose-auto-increment");

//Init auto increament
autoIncreament.initialize(mongoose.connection);

const SubscriptionSchema = new mongoose.Schema({
  name: String,
  price: String,
});

const PointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    default: "Point",
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const HallSchema = new mongoose.Schema({
  name: String,
  city: String,
  images: [String],
  brief: String,
  subscriptions: [SubscriptionSchema],
  location: {
    type: PointSchema,
    index: "2dsphere",
  },
  createDate: {
    type: Date,
    default: Date.now(),
  },
});

HallSchema.plugin(autoIncreament.plugin, { model: "Hall", startAt: 1 });

module.exports = mongoose.model("Hall", HallSchema, "halls");
