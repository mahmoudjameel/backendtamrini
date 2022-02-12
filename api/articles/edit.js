const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const ArticleModel = require("../../models/Article");
const validation = require("../../validation/article");

router.post("/", async (req, res) => {
  try {
    const article = req.body;

    //Validation
    const validateArticle = await validation({
      ...article,
      files: req.files,
      edit: true,
    });
    if (!validateArticle.status) {
      return res.json(validateArticle);
    }

    /********************************************************/
    //Validate _id
    if (!article._id) {
      return res.json({
        status: false,
        errors: ["رقم المقالة غير موجود ؟"],
      });
    }

    /********************************************************/
    //Check if article exist on DB
    let articleSearch = await ArticleModel.findOne({ _id: article._id });

    if (!articleSearch) {
      return res.json({
        status: false,
        errors: ["هذه المقالة غير موجودة في قاعدة البيانات"],
      });
    }
    /********************************************************/

    let { title, content, mainImage } = validateArticle;
    /********************************************************/
    //Check if image is not changed
    if (mainImage.length > 0) {
      //Save the new image
      const imagesToSave = [];
      for (const image of mainImage) {
        const mainImageUniqueName = `${uuidv4()}.${image.name
          .split(".")
          .pop()}`;
        await image.mv(
          path.join(
            __dirname,
            "..",
            "..",
            "images",
            "articles",
            mainImageUniqueName
          )
        );
        imagesToSave.push(mainImageUniqueName);
      }

      for (const image of articleSearch.mainImage) {
        //delete the old image
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

      /********************************************************/
      //Edit the article on DB
      const result = await ArticleModel.updateOne(
        { _id: article._id },
        {
          title,
          content,
          mainImage: imagesToSave,
        }
      );

      if (result.nModified === 0) {
        return res.json({
          status: false,
          errors: ["لم تقم بإجراء أي تغيير"],
        });
      }
    } else {
      //Edit the article on DB
      const result = await ArticleModel.updateOne(
        { _id: article._id },
        {
          title,
          content,
        }
      );

      if (result.nModified === 0) {
        return res.json({
          status: false,
          errors: ["لم تقم بإجراء أي تغيير"],
        });
      }
    }

    /********************************************************/
    //Get the new article
    articleSearch = await ArticleModel.findOne({ _id: article._id });

    /********************************************************/

    articleSearch = articleSearch.toObject();
    //Send the success response
    return res.json({
      status: true,
      messages: ["تم تعديل المقال بنجاح"],
      article: {
        ...articleSearch,
        mainImage: articleSearch.mainImage.map(image => `${req.protocol}://${req.headers.host}/images/articles/${image}`),
      },
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /articles/edit, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
