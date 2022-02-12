const express = require("express");
const router = express.Router();
const UserModel = require("../../models/User");
const validation = require("../../validation/users/edit");

router.post("/", async (req, res) => {
  try {
    const user = req.body;

    //Check if the user has permissions
    if (!(req.user && (req.user._id === user._id || req.user.role === "admin"))) {
      return res.json({
        status: false,
        errors: ["ليس لديك صلاحية تعديل هذا الحساب"],
      });
    }

    //Validation
    const validateUser = await validation(user);
    if (!validateUser.status) {
      return res.json(validateUser);
    }

    if (req.user.role !== "admin") {
      delete validateUser.user.role;
    }
    /********************************************************/

    //Update the user
    let result = await UserModel.updateOne(
      { _id: user._id },
      {
        ...validateUser.user,
      }
    );

    if (result.nModified === 0) {
      return res.json({
        status: false,
        errors: ["لم تقم بتغيير أي شئ !"],
      });
    }

    //Get the user after update
    let userSearch = await UserModel.findOne({ _id: user._id });

    delete userSearch.password;

    return res.json({
      status: true,
      messages: ["تم تعديل البيانات بنجاح"],
      user: userSearch,
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
