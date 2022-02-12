const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const HomeExerciseModel = require("../../models/HomeExercise");
const VideoExerciseModel = require("../../models/VideoExercise");

router.post("/", async (req, res) => {
  try {
    //Check for permissions
    if (!(req.user && req.user.role === "admin")) {
      return res.json({
        status: false,
        errors: ["ليس لديك صلاحية الوصول الي هذه البيانات"],
      });
    }

    let { _id, type } = req.body;

    //Validation
    if (!+type || ![1, 2].includes(+type)) {
      return res.json({
        status: false,
        errors: ["يجب تحديد نوع القسم"],
      });
    }

    //If id is empty
    if (!_id)
      return res.json({
        status: false,
        errors: ["يجب ارسال رقم التمرين لحذفه"],
      });

    //Check if article exist or not
    let exerciseSearch =
      type === 1
        ? await HomeExerciseModel.findOne({
            _id,
          })
        : type === 2
        ? await VideoExerciseModel.findOne({
            _id,
          })
        : null;

    if (!exerciseSearch)
      return res.json({
        status: false,
        errors: ["هذه التمرين غير موجودة بقاعدة البيانات"],
      });

    let result =
      type === 1
        ? await HomeExerciseModel.deleteOne({ _id })
        : type === 2
        ? await VideoExerciseModel.deleteOne({ _id })
        : null;

    if (result.deleteCount === 0)
      return res.json({
        status: false,
        errors: ["حدث خطأ ما أثناء حذف التمرين"],
      });

    switch (type) {
      case 1:
        //delete all images
        for (let image of exerciseSearch.images) {
          fs.existsSync(
            path.join(__dirname, "..", "..", "images", "home-exercises", image)
          )
            ? fs.unlinkSync(
                path.join(
                  __dirname,
                  "..",
                  "..",
                  "images",
                  "home-exercises",
                  image
                )
              )
            : null;
        }
        break;
    }

    return res.json({
      status: true,
      messages: [`تم حذف التمرين رقم ${_id} بنجاح`],
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /home-exercises/delete, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
