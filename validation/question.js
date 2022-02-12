const emailValidator = require("email-validator");
const bcrypt = require("bcrypt");
const QuestioneModel = require("../models/Question");

module.exports = async ({ question }) => {
  try {
    let errors = [];

    //Required

    if (!question) errors.push("يجب كتابة السؤال  ");

    //Send any empty errors
    if (errors.length !== 0) {
      return {
        status: false,
        errors,
      };
    }

    return {
      status: true,
      question,
    };
  } catch (e) {
    return {
      status: false,
      errors: [e.message],
    };
  }
};
