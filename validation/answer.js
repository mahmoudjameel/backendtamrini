const emailValidator = require("email-validator");
const bcrypt = require("bcrypt");
const QuestionModel = require("../models/Question");

module.exports = async ({ questionId, answer }) => {
  try {
    let errors = [];

    //Required

    if (!(await QuestionModel.findById(questionId)))
      errors.push("السؤال الذي أجبت عليه غير موجود");
    if (!answer) errors.push("يجب كتابة إجابة   ");

    //Send any empty errors
    if (errors.length !== 0) {
      return {
        status: false,
        errors,
      };
    }

    return {
      status: true,
      answer,
      questionId: questionId,
    };
  } catch (e) {
    return {
      status: false,
      errors: [e.message],
    };
  }
};
