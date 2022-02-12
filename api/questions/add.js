const express = require("express");
const router = express.Router();
const QuestionModel = require("../../models/Question");
const UserModel = require("../../models/User");
const validation = require("../../validation/question");

router.post("/", async (req, res) => {
  try {
    const data = req.body;

    console.log(req.user);
    console.log(data);

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

    const userData = await UserModel.findById(req.user._id);
    const { question } = validateData;

    const saveQuestion = await QuestionModel.create({
      user: userData,
      question: question,
    });

    if (!saveQuestion) {
      return res.json({
        status: false,
        errors: ["حدث خطأ غير متوقع ، يرجي المحاولة فيما بعد"],
      });
    }

    return res.json({
      status: true,
      messages: ["تم اضافة السؤال بنجاح"],
      question: question,
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /question/add, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
