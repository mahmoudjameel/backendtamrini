const express = require("express");
const router = express.Router();
const Question = require("../../models/Question");

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
        errors: ["يجب تحديد السؤال الذي تريد حذفه"],
      });

    //Check if article exist or not
    let questionSearch = await Question.findOne({
      _id: req.body._id,
    });
    if (!questionSearch)
      return res.json({
        status: false,
        errors: [" السؤال غير موجودة بقاعدة البيانات"],
      });

    let result = await Question.deleteOne({ _id: req.body._id });

    if (result.deleteCount === 0)
      return res.json({
        status: false,
        errors: ["حدث خطأ ما أثناء حذف السؤال"],
      });

    return res.json({
      status: true,
      messages: [`تم حذف  السؤال رقم ${req.body._id} بنجاح`],
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /quations/delete, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
