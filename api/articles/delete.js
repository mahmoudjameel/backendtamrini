const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const ArticleModel = require("../../models/Article");

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
        errors: ["يجب ارسال رقم المقالة لحذفها"],
      });

    //Check if article exist or not
    let articleSearch = await ArticleModel.findOne({ _id: req.body._id });
    if (!articleSearch)
      return res.json({
        status: false,
        errors: ["هذه المقالة غير موجودة بقاعدة البيانات"],
      });

    let result = await ArticleModel.deleteOne({ _id: req.body._id });

    if (result.deleteCount === 0)
      return res.json({
        status: false,
        errors: ["حدث خطأ ما أثناء حذف المقالة"],
      });

    //delete the  image
    for (const image of articleSearch.mainImage) {
      fs.existsSync(
        path.join(
          __dirname,
          "..",
          "..",
          "images",
          "articles",
          image
        )
      )
        ? fs.unlinkSync(
          path.join(
            __dirname,
            "..",
            "..",
            "images",
            "articles",
            image
          )
        )
        : null;
    }

    return res.json({
      status: true,
      messages: [`تم حذف المقالة رقم ${req.body._id} بنجاح`],
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /article/delete, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
