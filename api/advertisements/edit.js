const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const AdvertisementModel = require("../../models/Advertisement");
const validation = require("../../validation/advertisement");

router.post("/", async (req, res) => {
  try {
    const { _id } = req.body;
    //Validation
    const validateAdvertisement = await validation({ files: req.files, link: req.body && req.body.link, edit: true });
    if (!validateAdvertisement.status) {
      return res.json(validateAdvertisement);
    }

    /********************************************************/
    //Validate _id
    if (!_id) {
      return res.json({
        status: false,
        errors: ["هذا الاعلان غير موجود بقاعدة البيانات"],
      });
    }

    /********************************************************/
    //Check if product exist on DB
    let advertisementSearch = await AdvertisementModel.findOne({ _id: _id });

    if (!advertisementSearch) {
      return res.json({
        status: false,
        errors: ["هذا الاعلان غير موجودة في قاعدة البيانات"],
      });
    }
    /********************************************************/

    let { image, link } = validateAdvertisement;

    /********************************************************/
    //Save the new image
    let mainImageUniqueName = "";
    if(image) {
      mainImageUniqueName = `${uuidv4()}.${image.name
        .split(".")
        .pop()}`;
      await image.mv(
        path.join(
          __dirname,
          "..",
          "..",
          "images",
          "ads",
          mainImageUniqueName
        )
      );

      //delete the old image
      fs.existsSync(
        path.join(
          __dirname,
          "..",
          "..",
          "images",
          "ads",
          advertisementSearch.image
        )
      )
        ? fs.unlinkSync(
          path.join(
            __dirname,
            "..",
            "..",
            "images",
            "ads",
            advertisementSearch.image
          )
        )
        : null;
    }

      /********************************************************/
      const values = {
        link
      };
      if(mainImageUniqueName) {
        values.image = mainImageUniqueName;
      }
      //Edit the product on DB
      const result = await AdvertisementModel.updateOne(
        { _id: _id },
        values
      );

      if (result.nModified === 0) {
        return res.json({
          status: false,
          errors: ["لم تقم بإجراء أي تغيير"],
        });
      }

    /********************************************************/
    //Get the new product
    advertisementSearch = await AdvertisementModel.findOne({ _id: _id });
    advertisementSearch = advertisementSearch.toObject();

    /********************************************************/
    //Send the success response
    return res.json({
      status: true,
      messages: ["تم تعديل المنتج بنجاح"],
      advertisement: {
        ...advertisementSearch,
        image: `${req.protocol}://${req.headers.host}/images/ads/${advertisementSearch.image}`
      },
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /advertisements/edit, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
