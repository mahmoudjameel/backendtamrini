const emailValidator = require("email-validator");
const bcrypt = require("bcrypt");
const UserModel = require("../../models/User");

module.exports = async ({
  name,
  username,
  email,
  password,
  passwordConfirm,
  phoneNumber,
}) => {
  try {
    let errors = [];

    if (!name) errors.push("يجب كتابة الاسم");
    if (!username) errors.push("يجب كتابة اسم المستخدم");
    if (!email) errors.push("يجب كتابة البريد الالكتروني");
    if (!password) errors.push("يجب كتابة كلمة المرور");
    if (!passwordConfirm) errors.push("يجب كتابة تأكيد كلمة المرور");
    if (!phoneNumber) errors.push("يجب كتابة رقم الهاتف");

    //Send any empty errors
    if (errors.length !== 0)
      return {
        status: false,
        errors,
      };

    //Unique
    if (await UserModel.findOne({ email }))
      errors.push("هذا البريد الالكتروني مسجل من قبل");
    if (await UserModel.findOne({ username }))
      errors.push("اسم المستخدم مسجل من قبل");
    if (await UserModel.findOne({ phoneNumber }))
      errors.push("رقم الهاتف مسجل من قبل");

    //Password
    if (password !== passwordConfirm)
      errors.push("يجب أن تكون كلمة المرور وتأكيد كلمة المرور متطابقان");
    if (password.length < 6)
      errors.push("يجب أن تحتوي كلمة المرور علي 6 أحرف علي الأقل");

    //Email
    if (!emailValidator.validate(email))
      errors.push("هذا البريد الالكتروني غير صالح");

    if (errors.length === 0) {
      //hash password
      password = await bcrypt.hash(password, 10);

      const user = {
        name,
        username,
        email,
        password,
        phoneNumber,
      };

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
