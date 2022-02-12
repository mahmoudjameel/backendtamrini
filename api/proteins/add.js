const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const ProteinModel = require("../../models/Protein");
const ProteinCategory = require("../../models/ProteinCategory");
const validation = require("../../validation/protein");

router.post("/", async (req, res) => {
  try {
    const protein = req.body;

    //Check for permissions
    if (!(req.user && req.user.role === "admin")) {
      return res.json({
        status: false,
        errors: ["ليس لديك صلاحية الوصول الي هذه البيانات"]
      });
    }

    //Validation
    const validateProtein = await validation({ ...protein, files: req.files });
    if (!validateProtein.status) {
      return res.json(validateProtein);
    }

    /********************************************************/

    let { name, description, mainImage, categoryId } = validateProtein;
    // check if proteins folder dosen't exists
    var fs = require("fs");
    var dir = path.join(__dirname, "..", "..", "images", "proteins");

    // if not create one
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    let imagesToSave = [];
    //Save the images
    for (let image of mainImage) {
      const imageUniqueName = `${uuidv4()}.${image.name.split(".").pop()}`;
      await image.mv(
        path.join(
          __dirname,
          "..",
          "..",
          "images",
          "proteins",
          imageUniqueName
        )
      );

      imagesToSave.push(imageUniqueName);
    }

    /********************************************************/

    //Save the protein to DB
    const saveProtein = await ProteinModel.create({
      name,
      description,
      mainImage: imagesToSave,
      categoryId
    });

    if (!saveProtein) {
      return res.json({
        status: false,
        errors: ["حدث خطأ غير متوقع ، يرجي المحاولة فيما بعد"]
      });
    }

    /********************************************************/
    saveProtein.mainImage = Array.isArray(saveProtein.mainImage) ? (
      saveProtein.mainImage.map(image => `${req.protocol}://${req.headers.host}/images/proteins/${image}`)
    ) : `${req.protocol}://${req.headers.host}/images/proteins/${saveProtein.mainImage}`;

    await ProteinCategory.populate(saveProtein, { path: "categoryId" });

    //Send the success response
    return res.json({
      status: true,
      messages: ["تم اضافة المكمل الغذائي بنجاح"],
      protein: saveProtein
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /proteins/add, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message]
    });
  }
});

module.exports = router;
