const mongoose = require("mongoose");
const autoIncreament = require("mongoose-auto-increment");

//Init auto increament
autoIncreament.initialize(mongoose.connection);

const ProteinSchema = new mongoose.Schema({
  name: String,
  description: String,
  mainImage: [String],
  categoryId: { type: Number, ref: "ProteinCategories", default: 1 },
  createDate: {
    type: Date,
    default: Date.now(),
  },
});

ProteinSchema.plugin(autoIncreament.plugin, { model: "Protein", startAt: 1 });

module.exports = mongoose.model("Protein", ProteinSchema, "proteins");
