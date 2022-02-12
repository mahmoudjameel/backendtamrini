const emailValidator = require("email-validator");
const bcrypt = require("bcrypt");
const UserModel = require("../../models/User");

module.exports = async ({
  _id,
  name,
  username,
  email,
  password,
  passwordConfirm,
  phoneNumber,
  role,
}) => {
  try {
    let errors = [];

    //Required
    if (!_id) errors.push("رقم المستخدم مفقود !");
    if (!name) errors.push("يجب كتابة الاسم");
    if (!username) errors.push("يجب كتابة اسم المستخدم");
    if (!email) errors.push("يجب كتابة البريد الالكتروني");
    if (!phoneNumber) errors.push("يجب كتابة رقم الهاتف");
    if (!role) errors.push("يجب تحديد مستوي المستخدم");

    //Check if user exist on DB
    if (!(await UserModel.findOne({ _id })))
      errors.push("هذا المستخدم غير مسجل بقاعدة البيانات");

    //Send any empty errors
    if (errors.length !== 0)
      return {
        status: false,
        errors,
      };

    //Unique
    if (await UserModel.findOne({ _id: { $ne: _id }, email }))
      errors.push("هذا البريد الالكتروني مسجل من قبل");
    if (await UserModel.findOne({ _id: { $ne: _id }, username }))
      errors.push("اسم المستخدم مسجل من قبل");
    if (await UserModel.findOne({ _id: { $ne: _id }, phoneNumber }))
      errors.push("رقم الهاتف مسجل من قبل");

    //Password
    if (password || passwordConfirm) {
      if (password !== passwordConfirm)
        errors.push("يجب أن تكون كلمة المرور وتأكيد كلمة المرور متطابقان");
      if (password.length < 6)
        errors.push("يجب أن تحتوي كلمة المرور علي 6 أحرف علي الأقل");
    }

    //Email
    if (!emailValidator.validate(email))
      errors.push("هذا البريد الالكتروني غير صالح");

    if (errors.length === 0) {
      const user = {
        name,
        username,
        email,
        phoneNumber,
        role,
      };

      //hash password
      if (password) {
        password = await bcrypt.hash(password, 10);
        user.password = password;
      }

      return {
        status: true,
        user,
      };
    } else {
      return {
        status: false,
        errors,
      };
    }
  } catch (e) {
    return {
      status: false,
      errors: [e.message],
    };
  }
};
