// @ts-nocheck
const express = require("express");
const router = express.Router();
const DietModel = require("../../models/Diet");

router.post("/", async (req, res) => {
  try {
    let diets = [];
    if (req.body._id) {
      let dietSearch = await DietModel.findOne({ _id: req.body._id });

      if (!dietSearch) {
        return res.json({
          status: false,
          errors: ["هذه الاكلة غير مسجلة في قاعدة البيانات"],
        });
      }

      diets = [...diets, dietSearch.toObject()];
    } else {
      let dietsSearch = await DietModel.find({}).sort({ createDate: -1 });

      if (dietsSearch.length === 0) {
        return res.json({
          status: false,
          errors: ["لا يوجد اكلات"],
        });
      }

      diets = [...diets, ...dietsSearch];
    }

    /********************************************************/
    //Edit the images to be urls
    let finalImages = [];
    for (diet of diets) {
      for (image of diet.images) {
        finalImages.push(
          `${req.protocol}://${req.headers.host}/images/diets/${image}`
        );
      }
      diet.images = finalImages;
      finalImages = [];
    }

    return res.json({
      status: true,
      diets: diets,
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /diet/get, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
