const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const AdvertisementModel = require("../../models/Advertisement");
const validation = require("../../validation/advertisement");

router.post("/", async (req, res) => {
  try {

    //Check for permissions
    if (!(req.user && req.user.role === "admin")) {
      return res.json({
        status: false,
        errors: ["ليس لديك صلاحية الوصول الي هذه البيانات"]
      });
    }

    //Validation
    const validateAds = await validation({ files: req.files, link: req.body && req.body.link });
    if (!validateAds.status) {
      return res.json(validateAds);
    }
    /********************************************************/

    let { image, link } = validateAds;
    //Save the image
    const mainImageUniqueName = `${uuidv4()}.${image.name
      .split(".")
      .pop()}`;

    // check if products folder dosen't exists
    var fs = require("fs");
    var dir = path.join(__dirname, "..", "..", "images", "ads");

    // if not create one
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    // then move the image to the created folder
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

    /********************************************************/

    const values = {
      image: mainImageUniqueName
    }

    if(link) {
      values.link = link;
    }

    //Save the product to DB
    const saveAds = await AdvertisementModel.create(values);

    if (!saveAds) {
      return res.json({
        status: false,
        errors: ["حدث خطأ غير متوقع ، يرجي المحاولة فيما بعد"]
      });
    }

    /********************************************************/

    saveAds.image = `${req.protocol}://${req.headers.host}/images/ads/${saveAds.image}`;
    //Send the success response
    return res.json({
      status: true,
      messages: ["تم اضافة المنتج بنجاح"],
      advertisement: saveAds
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /advertisements/add, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message]
    });
  }
});

module.exports = router;
