const express = require("express");
const router = express.Router();
const BarcodeModel = require("../../models/BarCode");

router.post("/", async (req, res) => {
  try {
    let barcodes = [];
    if (req.body.code) {
      let barcodeSearch;

      if (req.body.type != null) {
        console.log("with type");
        barcodeSearch = await BarcodeModel.findOne({
          code: req.body.code,
          type: req.body.type,
        });
      } else {
        barcodeSearch = await BarcodeModel.findOne({ code: req.body.code });
      }

      if (!barcodeSearch) {
        return res.json({
          status: false,
          errors: ["هذه الباركود غير مسجلة في قاعدة البيانات"],
        });
      }

      barcodes = [...barcodes, barcodeSearch.toObject()];
    } else {
      let barcodeSearch = await BarcodeModel.find({});

      if (barcodeSearch.length === 0) {
        return res.json({
          status: false,
          errors: ["لا يوجد باركود"],
        });
      }

      barcodes = [...barcodes, ...barcodeSearch];
    }

    /********************************************************/
    //Edit the image to be url
    barcodes.map((barcode) => {
      barcode.mainImage = Array.isArray(barcode.mainImage)
        ? barcode.mainImage.map(
            (image) =>
              `${req.protocol}://${req.headers.host}/images/barcodes/${image}`
          )
        : `${req.protocol}://${req.headers.host}/images/barcodes/${barcode.mainImage}`;
      // console.log(article);
    });

    return res.json({
      status: true,
      barcodes: barcodes,
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /users/login, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
