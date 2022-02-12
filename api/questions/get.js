// @ts-nocheck
const express = require("express");
const router = express.Router();
const QuestionModel = require("../../models/Question");

router.post("/", async (req, res) => {
  try {
    let questions = [];
    if (req.body._id) {
      let questionSearch = await QuestionModel.findOne({
        _id: req.body._id,
      });

      if (!questionSearch) {
        return res.json({
          status: false,
          errors: ["هذا السؤال غير مسجل في قاعدة البيانات"],
        });
      }

      questions = [...questions, questionSearch.toObject()];
    } else {
      let questionSearch = await QuestionModel.find({}).sort({ time: -1 });

      if (questionSearch.length === 0) {
        return res.json({
          status: false,
          errors: ["لا يوجد أسئلة"],
        });
      }

      questions = [...questions, ...questionSearch];
    }

    /********************************************************/

    return res.json({
      status: true,
      questions: questions,
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /questions/get, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
