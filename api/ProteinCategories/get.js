const express = require("express");
const router = express.Router();
const ProteinCategoryModel = require("../../models/ProteinCategory");

router.post("/", async (req, res) => {
  try {
    let proteinsCats = [];
    if (req.body._id) {
      let ProteinCatSearch = await ProteinCategoryModel.findOne({ _id: req.body._id });

      if (!ProteinCatSearch) {
        return res.json({
          status: false,
          errors: ["هذا القسم غير مسجل في قاعدة البيانات"],
        });
      }

      proteinsCats = [...proteinsCats, ProteinCatSearch.toObject()];
    } else {
      let proteinSearch = await ProteinCategoryModel.find({});

      if (proteinSearch.length === 0) {
        return res.json({
          status: false,
          errors: ["لا يوجد أقسام لعرضها"],
        });
      }

      proteinsCats = [...proteinsCats, ...proteinSearch];
    }

    /********************************************************/
    //Edit the image to be url
    proteinsCats.map((prot) => {
      prot.image = `${req.protocol}://${req.headers.host}/images/protein-categories/${prot.image}`;
    });

    return res.json({
      status: true,
      proteinsCats,
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /ProteinCategories/get, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
