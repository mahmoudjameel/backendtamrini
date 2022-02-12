const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const BarcodeModel = require("../../models/BarCode");
const validation = require("../../validation/barcode");

router.post("/", async (req, res) => {
  try {
    //Check for permissions
    if (!(req.user && req.user.role === "admin")) {
      return res.json({
        status: false,
        errors: ["ليس لديك صلاحية الوصول الي هذه البيانات"],
      });
    }

    const barcodeData = req.body;

    if (!barcodeData._id) {
      return res.json({
        status: false,
        errors: ["يجب تحديد الأكلة التي تريد تعديلها"],
      });
    }

    const validateBarcode = await validation({
      ...barcodeData,
      files: req.files,
    });
    if (!validateBarcode.status) {
      return res.json(validateBarcode);
    }

    /********************************************************/
    //Check if paymentMethod exist on DB
    let barcodeSearch = await BarcodeModel.findOne({
      _id: barcodeData._id,
    });

    if (!barcodeSearch) {
      return res.json({
        status: false,
        errors: ["هذه الباركود غير موجودة في قاعدة البيانات"],
      });
    }

    let { name, code, type, protein, fat, energy, weight, carbs, mainImage } =
      validateBarcode;

    ////////image

    if (mainImage.length > 0) {
      //Save the new image
      const imagesToSave = [];
      for (const image of mainImage) {
        const mainImageUniqueName = `${uuidv4()}.${image.name
          .split(".")
          .pop()}`;
        await image.mv(
          path.join(
            __dirname,
            "..",
            "..",
            "images",
            "barcodes",
            mainImageUniqueName
          )
        );
        imagesToSave.push(mainImageUniqueName);
      }

      for (const image of barcodeSearch.mainImage) {
        //delete the old image
        fs.existsSync(
          path.join(__dirname, "..", "..", "images", "barcodes", image)
        )
          ? fs.unlinkSync(
              path.join(__dirname, "..", "..", "images", "barcodes", image)
            )
          : null;
      }

      const result = await BarcodeModel.updateOne(
        { _id: barcodeData._id },
        {
          name,
          code,
          type,
          protein,
          fat,
          energy,
          carbs,
          weight,
          mainImage: imagesToSave,
        }
      );

      if (result.nModified === 0) {
        return res.json({
          status: false,
          errors: ["لم تقم بإجراء أي تغيير"],
        });
      }
    }

    /********************************************************/
    //Edit the paymentMethod on DB

    /********************************************************/
    //Get the new paymentMethod
    barcodeSearch = await BarcodeModel.findOne({
      _id: barcodeData._id,
    });

    /********************************************************/
    //Send the success response
    return res.json({
      status: true,
      messages: ["تم تعديل الباركود بنجاح"],
      barcode: barcodeSearch,
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /barcode/edit, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
