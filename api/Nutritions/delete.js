const express = require("express");
const router = express.Router();
const NutritionsModel = require("../../models/nutritions");

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
        errors: ["يجب تحديد الأكلة الذي تريد حذفها"],
      });

    //Check if article exist or not
    let nutritionSearch = await NutritionsModel.findOne({
      _id: req.body._id,
    });
    if (!nutritionSearch)
      return res.json({
        status: false,
        errors: ["هذه الأكلة غير موجودة بقاعدة البيانات"],
      });

    let result = await NutritionsModel.deleteOne({ _id: req.body._id });

    if (result.deleteCount === 0)
      return res.json({
        status: false,
        errors: ["حدث خطأ ما أثناء حذف الأكلة"],
      });

    return res.json({
      status: true,
      messages: [`تم حذف الأكلة رقم ${req.body._id} بنجاح`],
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /Nutritions/delete, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
