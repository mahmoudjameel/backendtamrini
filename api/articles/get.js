const express = require("express");
const router = express.Router();
const ArticleModel = require("../../models/Article");

router.post("/", async (req, res) => {
  try {
    let articles = [];
    if (req.body._id) {
      let articleSearch = await ArticleModel.findOne({ _id: req.body._id });

      if (!articleSearch) {
        return res.json({
          status: false,
          errors: ["هذه المقالة غير مسجلة في قاعدة البيانات"],
        });
      }

      articles = [...articles, articleSearch.toObject()];
    } else {
      let articlesSearch = await ArticleModel.find({}).sort({ createDate: -1 });

      if (articlesSearch.length === 0) {
        return res.json({
          status: false,
          errors: ["لا يوجد مقالات"],
        });
      }

      articles = [...articles, ...articlesSearch];
    }

    /********************************************************/
    //Edit the image to be url
    articles.map((article) => {
      article.mainImage = Array.isArray(article.mainImage)
        ? article.mainImage.map(
            (image) =>
              `${req.protocol}://${req.headers.host}/images/articles/${image}`
          )
        : `${req.protocol}://${req.headers.host}/images/articles/${article.mainImage}`;
      // console.log(article);
    });

    return res.json({
      status: true,
      articles,
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
