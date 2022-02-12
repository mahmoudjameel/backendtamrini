const Token = require("../../models/token");
const express = require("express");
const sendPushNotification = require("./expo");
const router = express.Router();
const validation = require("../../validation/notification");

router.post("/", async function (req, res) {
  const { title, body } = req.body;
  const to = "all";
  const data = {};

  //Check for permissions
  if (!(req.user && req.user.role === "admin")) {
    return res.json({
      status: false,
      errors: ["ليس لديك صلاحية الوصول الي هذه البيانات"],
    });
  }

  //Validation

  const validate = await validation({
    title,
    body,
  });

  if (!validate.status) {
    return res.json(validate);
  }

  if (to === "all") {
    Token.find({}, (err, allTokens) => {
      if (err) {
        return res.json({
          status: false,
          errors: ["حدث خطأ غير متوقع ، يرجي المحاولة فيما بعد"],
        });
      }
      const tokens = allTokens.map((token) => {
        return token.tokenValue;
      });

      sendPushNotification(tokens, title, body, data);
      return res.json({
        status: true,
        messages: ["تم إرسال الإشعار  بنجاح"],
      });
    });
  } else {
    sendPushNotification([to], title, body, data);
    return res.json({
      status: true,
      messages: ["تم إرسال الإشعار  بنجاح"],
    });
  }
});

module.exports = router;
