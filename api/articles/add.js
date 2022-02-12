const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const ArticleModel = require("../../models/Article");
const validation = require("../../validation/article");

router.post("/", async (req, res) => {
  try {
    const article = req.body;

    //Check for permissions
    if (!(req.user && req.user.role === "admin")) {
      return res.json({
        status: false,
        errors: ["ليس لديك صلاحية الوصول الي هذه البيانات"],
      });
    }

    //Validation
    const validateArticle = await validation({ ...article, files: req.files });
    if (!validateArticle.status) {
      return res.json(validateArticle);
    }

    /********************************************************/

    let { title, content, mainImage } = validateArticle;

    let imagesToSave = [];
    // check if product-categories folder dosen't exists
    var fs = require("fs");
    var dir = path.join(__dirname, "..", "..", "images", "articles");

    // if not create one
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    //Save the images
    for (let image of mainImage) {
      const imageUniqueName = `${uuidv4()}.${image.name.split(".").pop()}`;
      await image.mv(
        path.join(__dirname, "..", "..", "images", "articles", imageUniqueName)
      );

      imagesToSave.push(imageUniqueName);
    }

    /********************************************************/

    //Save the article to DB
    let saveArticle = await ArticleModel.create({
      title,
      content,
      mainImage: imagesToSave,
    });

    if (!saveArticle) {
      return res.json({
        status: false,
        errors: ["حدث خطأ غير متوقع ، يرجي المحاولة فيما بعد"],
      });
    }

    /********************************************************/

    saveArticle = saveArticle.toObject();
    //Send the success response
    return res.json({
      status: true,
      messages: ["تم اضافة المقال بنجاح"],
      article: {
        ...saveArticle,
        mainImage: Array.isArray(saveArticle.mainImage)
          ? saveArticle.mainImage.map(
              (image) =>
                `${req.protocol}://${req.headers.host}/images/articles/${image}`
            )
          : `${req.protocol}://${req.headers.host}/images/articles/${saveArticle.mainImage}`,
      },
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /users/register, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
