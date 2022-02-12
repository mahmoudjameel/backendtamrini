const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const HomeExercisesCategory = require("../../models/HomeExerciseCategory");
const HomeExercise = require("../../models/HomeExercise");

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
        errors: ["يجب تحديد القسم الذي تريد حذفه"],
      });

    //Check if article exist or not
    let productSearch = await HomeExercisesCategory.findOne({
      _id: req.body._id,
    });

    console.log("tt" + productSearch);
    if (!productSearch)
      return res.json({
        status: false,
        errors: ["هذا القسم غير موجود بقاعدة البيانات"],
      });
    let exercises = await HomeExercise.find({
      categoryId: Number(req.body._id),
    });
    if (exercises.length > 0) {
      return res.json({
        status: false,
        errors: ["هذا القسم لديه تمارين بداخله"],
      });
    }

    let result = await HomeExercisesCategory.deleteOne({ _id: req.body._id });

    if (result.deleteCount === 0)
      return res.json({
        status: false,
        errors: ["حدث خطأ ما أثناء حذف المنتج"],
      });

    //delete the  image
    fs.existsSync(
      path.join(
        __dirname,
        "..",
        "..",
        "images",
        "home-exercise-categories",
        productSearch.image
      )
    )
      ? fs.unlinkSync(
          path.join(
            __dirname,
            "..",
            "..",
            "images",
            "home-exercise-categories",
            productSearch.image
          )
        )
      : null;

    return res.json({
      status: true,
      messages: [`تم حذف القسم رقم ${req.body._id} بنجاح`],
    });

    /********************************************************/
  } catch (e) {
    console.log(
      `Error in /HomeExercisesCategory/delete, error: ${e.message}`,
      e
    );
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
