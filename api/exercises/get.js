// @ts-nocheck
const express = require("express");
const router = express.Router();
const ImageExerciseModel = require("../../models/ImageExercise");
const VideoExerciseModel = require("../../models/VideoExercise");
const ImageExerciseCategoryModel = require("../../models/ImageExercisesCategory");
const VideoExerciseCategoryModel = require("../../models/VideoExercisesCategory");

router.post("/", async (req, res) => {
  try {
    let exercises = [];
    let { _id, type, categoryId } = req.body;

    //Validation
    if (!+type || ![1, 2].includes(+type)) {
      return res.json({
        status: false,
        errors: ["يجب تحديد نوع القسم"],
      });
    }

    if (_id) {
      let exerciseSearch =
        type === 1
          ? await ImageExerciseModel.findOne({
              _id,
            })
          : type === 2
          ? await VideoExerciseModel.findOne({
              _id,
            })
          : null;

      if (!exerciseSearch) {
        return res.json({
          status: false,
          errors: ["هذا التمرين غير مسجل في قاعدة البيانات"],
        });
      }

      exercises = [...exercises, exerciseSearch.toObject()];
    } else if (categoryId > 0) {
      let exercisesSearch =
        type === 1
          ? await ImageExerciseModel.find({
              categoryId,
            })
          : type === 2
          ? await VideoExerciseModel.find({
              categoryId,
            })
          : null;

      if (exercisesSearch.length === 0) {
        return res.json({
          status: false,
          errors: ["لا يوجد تمارين"],
        });
      }

      exercises = [...exercises, ...exercisesSearch];
    } else {
      let exercisesSearch =
        type === 1
          ? await ImageExerciseModel.find({})
          : type === 2
          ? await VideoExerciseModel.find({})
          : null;

      if (exercisesSearch.length === 0) {
        return res.json({
          status: false,
          errors: ["لا يوجد تمارين"],
        });
      }

      exercises = [...exercises, ...exercisesSearch];
    }

    /********************************************************/
    //Edit the image to be url
    switch (+type) {
      case 1:
        let finalImages = [];
        for (exercise of exercises) {
          for (image of exercise.images) {
            finalImages.push(
              `${req.protocol}://${req.headers.host}/images/image-exercises/${image}`
            );
          }
          exercise.images = finalImages;
          finalImages = [];
        }
        break;
    }
    if(type == 1) {
      await ImageExerciseCategoryModel.populate(exercises, { path: "categoryId" });
    } else if (type == 2) {
      // await VideoExerciseCategoryModel.populate(exercises, { path: "categoryId" });
    }
    return res.json({
      status: true,
      exercises,
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /exercises/get, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
