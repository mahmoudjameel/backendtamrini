const express = require("express");
const router = express.Router();
const QuestionModel = require("../../models/Question");
const validation = require("../../validation/answer");

router.post("/", async (req, res) => {
  try {
    const { questionId } = req.body;
    if (!(req.user && req.user.role === "user")) {
      return res.json({
        status: false,
        errors: ["ليس لديك صلاحية الوصول الي هذه البيانات"],
      });
    }

    //Validation

    if (!(await QuestionModel.findById(questionId))) {
      let errors = [];
      errors.push("السؤال الذي أعجبت عليه غير موجود");

      return {
        status: false,
        errors,
      };
    }
    /********************************************************/

    const question = await QuestionModel.findById(questionId);

    let isLike = true;
    if (question.likes.indexOf(req.user._id) >= 0) {
      isLike = false;
      question.likes = question.likes.filter(function (el) {
        return el != req.user._id;
      });
    } else {
      console.log(question.likes.indexOf(req.user._id));
      question.likes.push(req.user._id);
    }
    await question.save();

    return res.json({
      status: true,
      question: question,
      messages: isLike
        ? ["تم الإعجاب على السؤال بنجاح"]
        : ["تم عدم الإعجاب على السؤال بنجاح"],
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /questions/like, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
