const express = require("express");
const router = express.Router();
const UserModel = require("../../models/User");

router.post("/", async (req, res) => {
  try {

    //Check for permissions
    if (!(req.user && req.user.role === "admin")) {
      return res.json({
        status: false,
        errors: ["ليس لديك صلاحية الوصول الي هذه البيانات"],
      });
    }

    let users = [];
    if (req.body._id) {
      let userSearch = await UserModel.findOne({ _id: req.body._id });

      if (!userSearch) {
        return res.json({
          status: false,
          errors: ["هذا المستخدم غير مسجل في قاعدة البيانات"],
        });
      }

      users.push(userSearch.toObject());
    } else {
      let usersSearch = await UserModel.find({});

      if (usersSearch.length === 0) {
        return res.json({
          status: false,
          errors: ["لا يوجد مستخدمين مسجلين"],
        });
      }

      users = [...users, ...usersSearch];
    }

    return res.json({
      status: true,
      users
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
