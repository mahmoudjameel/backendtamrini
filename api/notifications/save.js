const Token = require("../../models/token");
const express = require("express");
const sendPushNotification = require("./expo");
const router = express.Router();

router.post("/", async function (req, res) {
  const token = req.body.token;

  console.log(token);
  if (token) {
    Token.find({ tokenValue: token }, (err, existingToken) => {
      if (err) {
        res.statusCode = 500;
        res.send(err);
      }
      if (!err && existingToken.length === 0) {
        const newToken = new Token({ tokenValue: req.body.token });
        newToken.save(function (err, savedToken) {
          if (err) {
            res.statusCode = 500;
            res.send(err);
          }
          res.send({ status: "success" });
        });
      } else {
        res.send({ status: "success" });
      }
    });
  } else {
    res.statusCode = 400;
    res.send({ message: "token not passed!" });
  }
});

module.exports = router;
