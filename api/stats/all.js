const express = require("express");
const router = express.Router();

//Models
const HallModel = require("../../models/Hall");
const ArticleModel = require("../../models/Article");
const ImageExerciseModel = require("../../models/ImageExercise");
const VideoExerciseModel = require("../../models/VideoExercise");
const ProductModel = require("../../models/Product");
const OrderModel = require("../../models/Order");
const UserModel = require("../../models/User");
const ProteinModel = require("../../models/Protein");
const DietModel = require("../../models/Diet");
const BarcodeModel = require("../../models/BarCode");

router.post("/", async (req, res) => {
  const halls = await HallModel.estimatedDocumentCount();
  const articles = await ArticleModel.estimatedDocumentCount();
  const imageExercises = await ImageExerciseModel.estimatedDocumentCount();
  const videoExercises = await VideoExerciseModel.estimatedDocumentCount();
  const products = await ProductModel.estimatedDocumentCount();
  const orders = await OrderModel.estimatedDocumentCount();
  const users = await UserModel.estimatedDocumentCount();
  const proteins = await ProteinModel.estimatedDocumentCount();
  const diets = await DietModel.estimatedDocumentCount();
  const barcodes = await BarcodeModel.estimatedDocumentCount();

  return res.json({
    status: true,
    stats: {
      halls,
      articles,
      imageExercises,
      videoExercises,
      products,
      orders,
      users,
      proteins,
      diets,
      barcodes,
    },
  });
});

module.exports = router;
