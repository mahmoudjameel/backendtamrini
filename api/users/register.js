const express = require("express");
const router = express.Router();
const UserModel = require("../../models/User");
const validation = require("../../validation/users/register");
const { createToken } = require("../../helpers/jwt");

router.post("/", async (req, res) => {
  try {
    const user = req.body;

    //Validation
    const validateUser = await validation(user);
    if (!validateUser.status) {
      return res.json(validateUser);
    }

    /********************************************************/

    //Save the user to DB
    const saveUser = await UserModel.create({
      ...validateUser.user,
      role: req.user && req.user.role === "admin" ? validateUser.role : "user",
    });
    if (!saveUser) {
      return res.json({
        status: false,
        errors: ["حدث خطأ غير متوقع ، يرجي المحاولة فيما بعد"],
      });
    }

    /********************************************************/

    //Send the jwt token with the success response
    const accessToken = await createToken({ _id: saveUser._id });

    if (!(req.user && req.user.role === "admin")) {
      res.cookie("access_token", accessToken);
    }
    return res.json({
      status: true,
      messages: ["تم التسجيل بنجاح"],
      accessToken,
      user: saveUser,
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
