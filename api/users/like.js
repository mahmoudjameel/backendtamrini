const express = require("express");
const router = express.Router();
const UserModel = require("../../models/User");
const validation = require("../../validation/users/like");

router.post("/", async (req, res) => {
  try {
    const data = req.body;
    console.log(req.user);
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
    let isDisliked = false;
    if (validateData.type === "article") {
      const index = userData.favoriteArticles.indexOf(validateData.articleId);
      if (index === -1) {
        userData.favoriteArticles.push(validateData.articleId);
      } else {
        userData.favoriteArticles.splice(index, 1);
        isDisliked = true;
      }
    } else if (validateData.type === "imageExercise") {
      const index = userData.favoriteImageExercices.indexOf(
        validateData.articleId
      );
      if (index === -1) {
        userData.favoriteImageExercices.push(validateData.articleId);
      } else {
        userData.favoriteImageExercices.splice(index, 1);
        isDisliked = true;
      }
    } else if (validateData.type === "videoExercise") {
      const index = userData.favoriteVideoExercices.indexOf(
        validateData.articleId
      );
      if (index === -1) {
        userData.favoriteVideoExercices.push(validateData.articleId);
      } else {
        userData.favoriteVideoExercices.splice(index, 1);
        isDisliked = true;
      }
    }
    await userData.save();

    return res.json({
      status: true,
      user: userData,
      messages: isDisliked
        ? validateData.type === "article"
          ? ["تم حذف الإعجاب بالمقال بنجاح"]
          : ["تم حذف الإعجاب بالتمرين بنجاح"]
        : validateData.type === "article"
        ? ["تم الإعجاب بالمقال بنجاح"]
        : ["تم الإعجاب بالتمرين بنجاح"],
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /users/like, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
