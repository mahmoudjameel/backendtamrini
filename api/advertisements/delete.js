const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const AdvertisementModel = require("../../models/Advertisement");

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
        errors: ["يجب تحديد المنتج الذي تريد حذفه"],
      });

    //Check if article exist or not
    let advertisementSearch = await AdvertisementModel.findOne({ _id: req.body._id });
    if (!advertisementSearch)
      return res.json({
        status: false,
        errors: ["هذا المنتج غير موجود بقاعدة البيانات"],
      });

    let result = await AdvertisementModel.deleteOne({ _id: req.body._id });

    if (result.deleteCount === 0)
      return res.json({
        status: false,
        errors: ["حدث خطأ ما أثناء حذف المنتج"],
      });

    //delete the  image
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

    return res.json({
      status: true,
      messages: [`تم حذف الاعلان رقم ${req.body._id} بنجاح`],
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /advertisements/delete, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
