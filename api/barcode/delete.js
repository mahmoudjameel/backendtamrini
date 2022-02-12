const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const BarcodeModel = require("../../models/BarCode");

router.post("/", async (req, res) => {
  try {
    //Check for permissions
    if (!(req.user && req.user.role === "admin")) {
      return res.json({
        status: false,
        errors: ["ليس لديك صلاحية الوصول الي هذه البيانات"],
      });
    }

    //If id is empty
    if (!req.body._id)
      return res.json({
        status: false,
        errors: ["يجب ارسال رقم الباركود لحذفها"],
      });

    //Check if article exist or not
    let barcodeSearch = await BarcodeModel.findOne({ _id: req.body._id });
    if (!barcodeSearch)
      return res.json({
        status: false,
        errors: ["هذه الباركود غير موجودة بقاعدة البيانات"],
      });

    let result = await BarcodeModel.deleteOne({ _id: req.body._id });

    if (result.deleteCount === 0)
      return res.json({
        status: false,
        errors: ["حدث خطأ ما أثناء حذف الباركود"],
      });

    //delete the  image
    for (const image of barcodeSearch.mainImage) {
      fs.existsSync(
        path.join(__dirname, "..", "..", "images", "barcodes", image)
      )
        ? fs.unlinkSync(
            path.join(__dirname, "..", "..", "images", "barcodes", image)
          )
        : null;
    }

    return res.json({
      status: true,
      messages: [`تم حذف الباركود رقم ${req.body._id} بنجاح`],
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /barcode/delete, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
