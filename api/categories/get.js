const express = require("express");
const router = express.Router();
const ImageCategoryModel = require("../../models/ImageExercisesCategory");
const VideoCategoryModel = require("../../models/VideoExercisesCategory");

router.post("/", async (req, res) => {
  try {
    let categories = [],
      type = +req.body.type;

    if (!type || ![1, 2].includes(type)) {
      return res.json({
        status: false,
        errors: ["يجب تحديد نوع القسم"],
      });
    }

    if (req.body._id) {
      let categorySearch =
        type === 1
          ? await ImageCategoryModel.findOne({ _id: req.body._id })
          : type === 2
          ? await VideoCategoryModel.findOne({ _id: req.body._id })
          : null;

      if (!categorySearch) {
        return res.json({
          status: false,
          errors: ["هذا القسم غير مسجل في قاعدة البيانات"],
        });
      }

      categories = [...categories, categorySearch.toObject()];
    } else {
      let categorySearch =
        type === 1
          ? await ImageCategoryModel.find({})
          : type === 2
          ? await VideoCategoryModel.find({})
          : [];

      if (categorySearch.length === 0) {
        return res.json({
          status: false,
          errors: ["لا يوجد أقسام حاليا"],
        });
      }

      categories = [...categories, ...categorySearch];
    }

    /********************************************************/
    //Edit the image to be url
    categories.map((category) => {
      category.image = `${req.protocol}://${req.headers.host}/images/image-exercise-categories/${category.image}`;
    });

    return res.json({
      status: true,
      categories,
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /users/login, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
