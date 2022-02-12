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

    //If id is empty
    if (!req.body._id)
      return res.json({
        status: false,
        errors: ["يجب ارسال رقم المستخدم لحذفه"],
      });

    //if user is trying to remove him self
    if (req.body._id === req.user._id)
      return res.json({
        status: false,
        errors: ["هل أنت مجنون ، لا يمكنك حذف نفسك !"],
      });

    //Check if user exist or not
    let userSearch = await UserModel.findOne({ _id: req.body._id });
    if (!userSearch)
      return res.json({
        status: false,
        errors: ["هذا المستخدم غير موجود بقاعدة البيانات"],
      });

    let result = await UserModel.deleteOne({ _id: req.body._id });

    if (result.deleteCount === 0)
      return res.json({
        status: false,
        errors: ["حدث خطأ ما أثناء حذف المستخدم"],
      });

    return res.json({
      status: true,
      messages: [`تم حذف المستخدم رقم ${req.body._id} بنجاح`],
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
