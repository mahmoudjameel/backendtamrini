const express = require("express");
const router = express.Router();
const validation = require("../../validation/users/login");
const { createToken } = require("../../helpers/jwt");
const UserModel = require("../../models/User");

//
// const { OAuth2Client } = require('google-auth-library')
// const client = new OAuth2Client(process.env.CLIENT_ID)
//

router.post("/", async (req, res) => {
  try {
    const user = req.body;

    //  console.log(user.user.name);

    if ((idToken = user.idToken)) {
      ///////with google

      let user1 = req.body;

      const name = user1.user.givenName;
      const email = user1.user.email;
      const username = user1.user.name;
      const password = user1.idToken;

      //DB Check
      let user = await UserModel.findOne({
        $or: [{ email: email }, { password: password }],
      });

      user = user && user.toObject();

      if (!user) {
        const us = {
          name,
          username,
          email,
          password,
        };
        user = await UserModel.create({
          ...us,
          role: "user",
        });

        if (!user) {
          return res.json({
            status: false,
            errors: ["حدث خطأ غير متوقع ، يرجي المحاولة فيما بعد"],
          });
        }
      }

      /********************************************************/

      //Send the jwt token with the success response
      const accessToken = await createToken({ _id: user._id });

      res.cookie("access_token", accessToken, { maxAge: 86400 * 1000 });
      res.cookie("user_data", JSON.stringify(user), {
        maxAge: 86400 * 1000,
      });

      return res.json({
        status: true,
        messages: ["تم تسجيل الدخول بنجاح"],
        user: user,
        accessToken,
      });
    } else {
      // normal
      //Validation
      const validateUser = await validation(user);
      if (!validateUser.status) {
        return res.json(validateUser);
      }
      if (validateUser.user.role.toLowerCase().includes("admin")) {
        res.json({
          status: false,
          errors: ["ليس لديك تصريح بالدخول"],
        });
      }

      /********************************************************/

      //Send the jwt token with the success response
      const accessToken = await createToken({ _id: validateUser.user._id });

      res.cookie("access_token", accessToken, { maxAge: 86400 * 1000 });
      res.cookie("user_data", JSON.stringify(validateUser.user), {
        maxAge: 86400 * 1000,
      });
      return res.json({
        status: true,
        messages: ["تم تسجيل الدخول بنجاح"],
        user: validateUser.user,
        accessToken,
      });
    }

    /********************************************************/
  } catch (e) {
    console.log(`Error in /users/login, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

router.post("/admin", async (req, res) => {
  try {
    const user = req.body;

    //Validation
    const validateUser = await validation(user);
    if (!validateUser.status) {
      return res.json(validateUser);
    }
    if (!validateUser.user.role.toLowerCase().includes("admin")) {
      res.json({
        status: false,
        errors: ["ليس لديك تصريح بالدخول إلى لوحة التحكم"],
      });
    }

    /********************************************************/

    //Send the jwt token with the success response
    const accessToken = await createToken({ _id: validateUser.user._id });

    res.cookie("access_token", accessToken, { maxAge: 86400 * 1000 });
    res.cookie("user_data", JSON.stringify(validateUser.user), {
      maxAge: 86400 * 1000,
    });
    return res.json({
      status: true,
      messages: ["تم تسجيل الدخول بنجاح"],
      user: validateUser.user,
      accessToken,
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
