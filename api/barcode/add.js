const express = require("express");
const router = express.Router();
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

    console.log(req.files);

    const validateBarcode = await validation({
      ...barcodeData,
      files: req.files,
    });
    if (!validateBarcode.status) {
      return res.json(validateBarcode);
    }

    /********************************************************/

    let { name, code, type, protein, fat, energy, carbs, weight, mainImage } =
      validateBarcode;

    //Save the payment method to DB
    // const saveBarcode = await BarcodeModel.create({
    //   name: validateBarcode.name,
    //   code: validateBarcode.code,
    //   type: validateBarcode.type,
    //   protein: validateBarcode.protein,
    //   fat: validateBarcode.fat,
    //   energy: validateBarcode.energy,
    //   carbs: validateBarcode.carbs,
    // });

    /********************************************** */
    // save image

    let imagesToSave = [];
    // check if product-categories folder dosen't exists
    var fs = require("fs");
    var dir = path.join(__dirname, "..", "..", "images", "barcodes");

    // if not create one
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    //Save the images
    for (let image of mainImage) {
      const imageUniqueName = `${uuidv4()}.${image.name.split(".").pop()}`;
      await image.mv(
        path.join(__dirname, "..", "..", "images", "barcodes", imageUniqueName)
      );

      imagesToSave.push(imageUniqueName);
    }

    /********************************************************/

    //Save the article to DB
    let saveBarcode = await BarcodeModel.create({
      name,
      code,
      type,
      protein,
      fat,
      energy,
      carbs,
      weight,
      mainImage: imagesToSave,
    });

    if (!saveBarcode) {
      return res.json({
        status: false,
        errors: ["حدث خطأ غير متوقع ، يرجي المحاولة فيما بعد"],
      });
    }

    //

    if (!saveBarcode) {
      return res.json({
        status: false,
        errors: ["حدث خطأ غير متوقع ، يرجي المحاولة فيما بعد"],
      });
    }

    /********************************************************/

    //Send the success response
    return res.json({
      status: true,
      messages: ["تم اضافة الباركود بنجاح"],
      barcodes: saveBarcode,
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /barcodes/add, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
