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
    const { _id, questionId } = req.body;

    if (!req.body.questionId)
      return res.json({
        status: false,
        errors: ["يجب تحديد السؤال "],
      });

    if (!req.body._id)
      return res.json({
        status: false,
        errors: ["يجب تحديد الجواب الذي تريد حذفه"],
      });

    let questionSearch = await Question.findOne({
      _id: req.body.questionId,
    });
    if (!questionSearch)
      return res.json({
        status: false,
        errors: [" الجواب غير موجود بقاعدة البيانات"],
      });

    let answers = questionSearch.answers.filter((u) => u._id != req.body._id);

    //  let result = await Question.deleteOne({ _id: req.body._id });

    // if (result.deleteCount === 0)
    //   return res.json({
    //     status: false,
    //     errors: ["حدث خطأ ما أثناء حذف السؤال"],
    //   });

    questionSearch.answers = answers;

    questionSearch.save();

    return res.json({
      status: true,
      messages: [`تم حذف  الجواب رقم ${req.body._id} بنجاح`],
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /quations/deleteAnswer, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
