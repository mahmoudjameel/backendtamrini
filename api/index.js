const express = require("express");
const router = express.Router();

//Routes
router.use("/advertisements", require("./advertisements/index"));
router.use("/users", require("./users/index"));
router.use("/articles", require("./articles/index"));
router.use("/categories", require("./categories/index"));
router.use("/exercises", require("./exercises/index"));
router.use("/halls", require("./halls/index"));
//
router.use("/diets", require("./diets/index"));

router.use("/barcodes", require("./barcode/index"));

router.use("/questions", require("./questions/index"));

router.use("/home-exercise-categories", require("./home-exercices/index"));
router.use("/home-exercise", require("./homeExercises/index"));

router.use("/notifications", require("./notifications/index"));
//
router.use("/proteins", require("./proteins/index"));
router.use("/products", require("./products/index"));
router.use("/product-categories", require("./productsCategories/index"));
router.use(
  "/image-exercise-categories",
  require("./imageExercisesCategory/index")
);
router.use(
  "/video-exercise-categories",
  require("./videoExercisesCategory/index")
);
router.use("/protein-categories", require("./ProteinCategories/index"));
router.use("/paymentMethods", require("./paymentMethods/index"));
router.use("/orders", require("./orders/index"));
router.use("/stats", require("./stats/index"));
router.use("/nutritions", require("./Nutritions/index"));

module.exports = router;
