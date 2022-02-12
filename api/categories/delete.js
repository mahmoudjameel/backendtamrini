const express = require("express");
const router = express.Router();
const ImageCategoryModel = require("../../models/ImageExercisesCategory");
const VideoCategoryModel = require("../../models/VideoExercisesCategory");

router.post("/", async (req, res) => {
  try {
    //Check for permissions
    if (!(req.user && req.user.role === "admin")) {
      return res.json({
        status: false,
        errors: ["ليس لديك صلاحية الوصول الي هذه البيانات"],
      });
    }

    let type = +req.body.type;

    //Validation
    if (req.body._id === undefined) {
      return res.json({
        status: false,
        errors: ["يجب تحديد القسم لحذفه"],
      });
    }

    if (!type || ![1, 2].includes(type)) {
      return res.json({
        status: false,
        errors: ["يجب تحديد نوع القسم"],
      });
    }

    let result =
      type === 1
        ? await ImageCategoryModel.deleteOne({ _id: req.body._id })
        : type === 2
        ? await VideoCategoryModel.deleteOne({ _id: req.body._id })
        : null;

    if (result.ok === 0 || result.deleteCount === 0) {
      return res.json({
        status: false,
        errors: ["حدث خطأ ما ، قد يكون هذا القسم غير مسجل في قاعدة البيانات"],
      });
    }

    return res.json({
      status: true,
      messages: [`تم حذف القسم رقم ${req.body._id} بنجاح`],
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /users/login, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
