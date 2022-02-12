const express = require("express");
const router = express.Router();
const ProteinModel = require("../../models/Protein");
const ProteinCategory = require("../../models/ProteinCategory");

router.post("/", async (req, res) => {
  try {
    let proteins = [];
    if (req.body._id) {
      let proteinSearch = await ProteinModel.findOne({ _id: req.body._id });

      if (!proteinSearch) {
        return res.json({
          status: false,
          errors: ["هذا المكمل الغذائي غير مسجلة في قاعدة البيانات"],
        });
      }

      proteins = [...proteins, proteinSearch.toObject()];
    } else if(req.body.categoryId) {
      let proteinsSearch = await ProteinModel.find({ categoryId: req.body.categoryId });

      if (proteinsSearch.length === 0) {
        return res.json({
          status: false,
          errors: ["لا يوجد مكملات غذائية لعرضها"],
        });
      }

      proteins = [...proteins, ...proteinsSearch];
    } else {
      let proteinsSearch = await ProteinModel.find({});

      if (proteinsSearch.length === 0) {
        return res.json({
          status: false,
          errors: ["لا يوجد مكملات غذائية لعرضها"],
        });
      }

      proteins = [...proteins, ...proteinsSearch];
    }

    /********************************************************/
    //Edit the image to be url
    proteins.map((protein) => {
      protein.mainImage = Array.isArray(protein.mainImage) ? (
        protein.mainImage.map(image => `${req.protocol}://${req.headers.host}/images/proteins/${image}`)
      ) : `${req.protocol}://${req.headers.host}/images/proteins/${protein.mainImage}`;
    });

    await ProteinCategory.populate(proteins, { path: "categoryId" });

    return res.json({
      status: true,
      proteins,
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /proteins/get, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
