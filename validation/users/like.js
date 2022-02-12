const emailValidator = require("email-validator");
const bcrypt = require("bcrypt");
const ArticleModel = require("../../models/Article");
const ImageExerciseModel = require("../../models/ImageExercise");
const VideoExerciseModel = require("../../models/VideoExercise");

module.exports = async ({
  type,
  articleId
}) => {
  try {
    let errors = [];

    //Required
    if (type === "article") {
      if (!(await ArticleModel.findById(articleId)))
        errors.push("المقال الذي أعجبت به غير موجود");
    } else if (type === "imageExercise") {
      if (!(await ImageExerciseModel.findById(articleId)))
        errors.push("التمرين الذي أعجبت به غير موجود");
    } else if (type === "videoExercise") {
      if (!(await VideoExerciseModel.findById(articleId)))
        errors.push("التمرين الذي أعجبت به غير موجود");
    }

    //Send any empty errors
    if (errors.length !== 0) {
      return {
        status: false,
        errors,
      };
    }

    return {
      status: true,
      type,
      articleId
    }
  } catch (e) {
    return {
      status: false,
      errors: [e.message],
    };
  }
};
