const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const DietModel = require("../../models/Diet");

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
        errors: ["يجب تحديد الاكلة التي تريد حذفها"],
      });

    //Check if article exist or not
    let dietSearch = await DietModel.findOne({ _id: req.body._id });
    if (!dietSearch)
      return res.json({
        status: false,
        errors: ["هذه الاكلة غير موجودة بقاعدة البيانات"],
      });

    let result = await DietModel.deleteOne({ _id: req.body._id });

    if (result.deleteCount === 0)
      return res.json({
        status: false,
        errors: ["حدث خطأ ما أثناء حذف الاكلة"],
      });

    //delete all images
    for (let image of dietSearch.images) {
      fs.existsSync(path.join(__dirname, "..", "..", "images", "diets", image))
        ? fs.unlinkSync(
            path.join(__dirname, "..", "..", "images", "diets", image)
          )
        : null;
    }

    return res.json({
      status: true,
      messages: [`تم حذف الاكلة رقم ${req.body._id} بنجاح`],
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /diet/delete, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
