const express = require("express");
const router = express.Router();
const NutritionModel = require("../../models/nutritions");

router.post("/", async (req, res) => {
  try {
    let nutritions = await NutritionModel.find({});

    if (nutritions.length === 0) {
      return res.json({
        status: false,
        errors: ["لا يوجد أكلات لعرضها"],
      });
    }

    return res.json({
      status: true,
      nutritions,
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /Nutritions/get, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
