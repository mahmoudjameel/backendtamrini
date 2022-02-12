const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const ProteinModel = require("../../models/Protein");
const ProteinCategory = require("../../models/ProteinCategory");
const validation = require("../../validation/protein");

router.post("/", async (req, res) => {
  try {
    const protein = req.body;

    //Validation
    const validateProtein = await validation({ ...protein, files: req.files, edit: true });
    if (!validateProtein.status) {
      return res.json(validateProtein);
    }

    /********************************************************/
    //Validate _id
    if (!protein._id) {
      return res.json({
        status: false,
        errors: ["هذا المكمل الغذائي غير موجود بقاعدة البيانات"],
      });
    }

    /********************************************************/
    //Check if protein exist on DB
    let proteinSearch = await ProteinModel.findOne({ _id: protein._id });

    if (!proteinSearch) {
      return res.json({
        status: false,
        errors: ["هذا المكمل الغذائي غير موجودة في قاعدة البيانات"],
      });
    }
    /********************************************************/

    let { name, description, mainImage, categoryId } = validateProtein;

    /********************************************************/
    //Check if image is not changed
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
            "proteins",
            mainImageUniqueName
          )
        );
        imagesToSave.push(mainImageUniqueName);
      }

      for (const image of proteinSearch.mainImage) {
        //delete the old image
        fs.existsSync(
          path.join(
            __dirname,
            "..",
            "..",
            "images",
            "proteins",
            image
          )
        )
          ? fs.unlinkSync(
            path.join(
              __dirname,
              "..",
              "..",
              "images",
              "proteins",
              image
            )
          )
          : null;
      }

      /********************************************************/
      //Edit the protein on DB
      const result = await ProteinModel.updateOne(
        { _id: protein._id },
        {
          name,
          description,
          mainImage: imagesToSave,
          categoryId
        }
      );

      if (result.nModified === 0) {
        return res.json({
          status: false,
          errors: ["لم تقم بإجراء أي تغيير"],
        });
      }
    } else {
      //Edit the protein on DB
      const result = await ProteinModel.updateOne(
        { _id: protein._id },
        {
          name,
          description,
          categoryId
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
    //Get the new protein
    proteinSearch = await ProteinModel.findOne({ _id: protein._id });

    proteinSearch = proteinSearch.toObject();

    await ProteinCategory.populate(proteinSearch, { path: "categoryId" });

    /********************************************************/
    //Send the success response
    return res.json({
      status: true,
      messages: ["تم تعديل المكمل الغذائي بنجاح"],
      protein: {
        ...proteinSearch,
        mainImage: proteinSearch.mainImage.map(image => `${req.protocol}://${req.headers.host}/images/proteins/${image}`),
      },
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /proteins/edit, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
