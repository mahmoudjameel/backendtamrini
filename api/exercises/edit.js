const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const ImageExerciseModel = require("../../models/ImageExercise");
const VideoExerciseModel = require("../../models/VideoExercise");
const ImageExerciseCategoryModel = require("../../models/ImageExercisesCategory");
const VideoExerciseCategoryModel = require("../../models/VideoExercisesCategory");
const imageValidation = require("../../validation/imageExercise");
const videoValidation = require("../../validation/videoExercise");

router.post("/", async (req, res) => {
  try {
    const exercise = req.body;

    let exerciseSearch, result, validateExercise;
    switch (+exercise.type) {
      case 1:
        //Validation
        validateExercise = await imageValidation({
          ...exercise,
          files: req.files,
          edit: true
        });
        if (!validateExercise.status) {
          return res.json(validateExercise);
        }

        /********************************************************/
        //Validate _id
        if (!exercise._id) {
          return res.json({
            status: false,
            errors: ["رقم التمرين غير موجود ؟"],
          });
        }

        /********************************************************/
        //Check if exercise exist on DB
        exerciseSearch = await ImageExerciseModel.findOne({
          _id: exercise._id,
        });

        if (!exerciseSearch) {
          return res.json({
            status: false,
            errors: ["هذا التمرين غير موجود في قاعدة البيانات"],
          });
        }

        /********************************************************/
        //Check if images are not changed
        let imagesToSave = [];
        for (let image of validateExercise.images) {
          if (exerciseSearch.images.indexOf(image.name) === -1) {
            //Save the new image
            const imageUniqueName = `${uuidv4()}.${image.name
              .split(".")
              .pop()}`;
            await image.mv(
              path.join(
                __dirname,
                "..",
                "..",
                "images",
                "image-exercises",
                imageUniqueName
              )
            );

            //delete the old image
            fs.existsSync(
              path.join(
                __dirname,
                "..",
                "..",
                "images",
                "image-exercises",
                exerciseSearch.images[validateExercise.images.indexOf(image)]
              )
            )
              ? fs.unlinkSync(
                  path.join(
                    __dirname,
                    "..",
                    "..",
                    "images",
                    "image-exercises",
                    exerciseSearch.images[
                      validateExercise.images.indexOf(image)
                    ]
                  )
                )
              : null;

            imagesToSave.push(imageUniqueName);
          } else {
            imagesToSave.push(image.name);
          }
        }
        /********************************************************/
        //Edit the exercise on DB
        if(imagesToSave.length) {
          result = await ImageExerciseModel.updateOne(
            { _id: exercise._id },
            {
              categoryId: validateExercise.categoryId,
              title: validateExercise.title,
              description: validateExercise.description,
              images: imagesToSave,
            }
          );
        } else {
          result = await ImageExerciseModel.updateOne(
            { _id: exercise._id },
            {
              categoryId: validateExercise.categoryId,
              title: validateExercise.title,
              description: validateExercise.description
            }
          );
        }

        if (result.nModified === 0) {
          return res.json({
            status: false,
            errors: ["لم تقم بإجراء أي تغيير"],
          });
        }

        /********************************************************/
        //Get the new exercise
        exerciseSearch = await ImageExerciseModel.findOne({
          _id: exercise._id,
        });

        await ImageExerciseCategoryModel.populate(exerciseSearch, { path: "categoryId" });
        exerciseSearch.images = exerciseSearch.images.map(image => `${req.protocol}://${req.headers.host}/images/image-exercises/${image}`);

        /********************************************************/
        //Send the success response
        return res.json({
          status: true,
          messages: ["تم تعديل التمرين بنجاح"],
          exercise: exerciseSearch,
        });

      case 2:
        //Validation
        validateExercise = await videoValidation({
          ...exercise,
        });
        if (!validateExercise.status) {
          return res.json(validateExercise);
        }

        /********************************************************/
        //Validate _id
        if (!exercise._id) {
          return res.json({
            status: false,
            errors: ["رقم التمرين غير موجود ؟"],
          });
        }

        /********************************************************/
        //Check if exercise exist on DB
        exerciseSearch = await VideoExerciseModel.findOne({
          _id: exercise._id,
        });

        if (!exerciseSearch) {
          return res.json({
            status: false,
            errors: ["هذا التمرين غير موجود في قاعدة البيانات"],
          });
        }

        /********************************************************/
        //Edit the exercise on DB
        result = await VideoExerciseModel.updateOne(
          { _id: exercise._id },
          {
            // categoryId: validateExercise.categoryId,
            title: validateExercise.title,
            description: validateExercise.description,
            videoUrl: validateExercise.videoUrl,
          }
        );

        if (result.nModified === 0) {
          return res.json({
            status: false,
            errors: ["لم تقم بإجراء أي تغيير"],
          });
        }

        /********************************************************/
        //Get the new exercise
        exerciseSearch = await VideoExerciseModel.findOne({
          _id: exercise._id,
        });
        // await VideoExerciseCategoryModel.populate(exerciseSearch, { path: "categoryId" });

        /********************************************************/
        //Send the success response
        return res.json({
          status: true,
          messages: ["تم تعديل التمرين بنجاح"],
          exercise: exerciseSearch,
        });
      default:
        return res.json({
          status: false,
          errors: ["يجب تحديد نوع القسم"],
        });
    }

    /********************************************************/
  } catch (e) {
    console.log(`Error in /exercises/edit, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
