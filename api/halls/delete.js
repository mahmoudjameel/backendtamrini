const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const HallModel = require("../../models/Hall");

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
        errors: ["يجب تحديد القاعة التي تريد حذفها"],
      });

    //Check if article exist or not
    let hallSearch = await HallModel.findOne({ _id: req.body._id });
    if (!hallSearch)
      return res.json({
        status: false,
        errors: ["هذه القاعة غير موجودة بقاعدة البيانات"],
      });

    let result = await HallModel.deleteOne({ _id: req.body._id });

    if (result.deleteCount === 0)
      return res.json({
        status: false,
        errors: ["حدث خطأ ما أثناء حذف المقالة"],
      });

    //delete all images
    for (let image of hallSearch.images) {
      fs.existsSync(path.join(__dirname, "..", "..", "images", "halls", image))
        ? fs.unlinkSync(
            path.join(__dirname, "..", "..", "images", "halls", image)
          )
        : null;
    }

    return res.json({
      status: true,
      messages: [`تم حذف القاعة رقم ${req.body._id} بنجاح`],
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /halls/delete, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
