const bcrypt = require("bcrypt");
const UserModel = require("../../models/User");

module.exports = async ({ user, password }) => {
  try {
    let errors = [];

    //Required
    if (!user) errors.push("يجب كتابة اسم المستخدم أو البريد الالكتروني");
    if (!password) errors.push("يجب كتابة كلمة المرور");

    //Send if any is empty
    if (errors.length !== 0) {
      return {
        status: false,
        errors,
      };
    }

    //DB Check
    let userSearch = await UserModel.findOne({
      $or: [{ email: user }, { username: user }],
    });
    userSearch = userSearch && userSearch.toObject();

    if (!userSearch) {
      errors.push(
        "اسم المستخدم أو البريد الالكتروني الذي أدخلته غير مسجل من قبل"
      );
    }

    if (errors.length !== 0) {
      return {
        status: false,
        errors,
      };
    }

    //Password Match
    if (!(await bcrypt.compare(password, userSearch.password))) {
      errors.push("كلمة المرور التي أدخلتها غير صحيحة");
    }

    if (errors.length !== 0) {
      return {
        status: false,
        errors,
      };
    }

    //delete the password from user object
    delete userSearch.password;

    return {
      status: true,
      user: userSearch,
    };
  } catch (e) {
    return {
      status: false,
      errors: [e.message],
    };
  }
};
