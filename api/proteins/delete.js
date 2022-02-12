const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const ProteinModel = require("../../models/Protein");

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
        errors: ["يجب تحديد المكمل الغذائي الذي تريد حذفه"],
      });

    //Check if article exist or not
    let proteinSearch = await ProteinModel.findOne({ _id: req.body._id });
    if (!proteinSearch)
      return res.json({
        status: false,
        errors: ["هذا المكمل الغذائي غير موجودة بقاعدة البيانات"],
      });

    let result = await ProteinModel.deleteOne({ _id: req.body._id });

    if (result.deleteCount === 0)
      return res.json({
        status: false,
        errors: ["حدث خطأ ما أثناء حذف المكمل الغذائي"],
      });

    //delete the  image
    for (const image of proteinSearch.mainImage) {
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

    return res.json({
      status: true,
      messages: [`تم حذف المكمل الغذائي رقم ${req.body._id} بنجاح`],
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /proteins/delete, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
