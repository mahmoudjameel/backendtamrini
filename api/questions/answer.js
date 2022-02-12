const express = require("express");
const router = express.Router();
const QuestionModel = require("../../models/Question");
const validation = require("../../validation/answer");

router.post("/", async (req, res) => {
  try {
    const data = req.body;
    if (!(req.user && req.user.role === "user")) {
      return res.json({
        status: false,
        errors: ["ليس لديك صلاحية الوصول الي هذه البيانات"],
      });
    }

    //Validation
    const validateData = await validation(data);
    if (!validateData.status) {
      return res.json(validateData);
    }

    /********************************************************/
    const { answer, questionId } = validateData;

    const question = await QuestionModel.findById(questionId);

    question.answers.push({ user: req.user._id, answer });

    await question.save();

    return res.json({
      status: true,
      question: question,
      messages: ["تمت الإجابة على السؤال بنجاح"],
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /questions/answer, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
