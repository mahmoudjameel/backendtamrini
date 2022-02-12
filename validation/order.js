const ProductModel = require("../models/Product");
const UserModel = require("../models/User");
const PaymentMethodModel = require("../models/PaymentMethod");

module.exports = async ({
  userId,
  productId,
  paymentMethodId,
  statusId,
  paymentImage,
  files,
}) => {
  try {
    let errors = [];

    //Required
    if (![1, 2, 3].includes(statusId)) errors.push("هناك خطأ في حالة الطلب");
    if (!userId) errors.push("يجب عليك تحديد المستخدم الذي تريد اضافة طلب له");
    if (!productId)
      errors.push("حدثت مشكلة أثناء تحديد المنتج الذي تريد شرائه");
    if (!paymentMethodId) errors.push("يجب تحديد وسيلة الدفع");

    //Send any empty errors
    if (errors.length !== 0)
      return {
        status: false,
        errors,
      };
    // let reg = /^data:image\/([\w+]+);base64,([\s\S]+)/;
    // let matchpaymentImage = paymentImage.match(reg);
    // if (!matchpaymentImage) {
    //   errors.push("هناك خطأ في الصورة التي تم تحميلها");
    // }

    // let paymentImage = null;

    // if (files && files.paymentImage) {
    //   //Image validation
    //   paymentImage = files.paymentImage;
    //   let extention = paymentImage.name.split(".").pop();

    //   if (!["jpg", "png", "jpeg"].includes(extention))
    //     errors.push("يجب أن يكون امتداد الصورة png أو jpeg أو jpg فقط");
    // }

    //Check if the product or payment method exist on DB
    const productSearch = await ProductModel.findById(productId);
    const userSearch = await UserModel.findById(userId);
    const paymentMethodSearch = await PaymentMethodModel.findById(
      paymentMethodId
    );

    if (!productSearch)
      errors.push("يبدو أن المنتج الذي اخترته غير مسجل لدينا");
    if (!userSearch)
      errors.push("يجب عليك تحديد المستخدم الذي تريد وضع طلب له");
    if (!paymentMethodSearch)
      errors.push("يبدو أن وسيلة الدفع التي اخترتها غير مسجلة لدينا");

    //Send any empty errors
    if (errors.length !== 0)
      return {
        status: false,
        errors,
      };

    return {
      status: true,
      userId,
      productId,
      paymentMethodId,
      statusId,
      paymentImage,
    };
  } catch (e) {
    return {
      status: false,
      errors: [e.message],
    };
  }
};
