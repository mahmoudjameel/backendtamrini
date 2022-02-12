const OrderModel = require("../models/Order");

module.exports = async ({ orderID, paymentImage, files }) => {
  try {
    let errors = [];

    //Required
    if (!orderID) errors.push("حدتث مشكلة اثناء تحديد الطلب الخاص بك");

    //Send any empty errors
    if (errors.length !== 0)
      return {
        status: false,
        errors,
      };
    let reg = /^data:image\/([\w+]+);base64,([\s\S]+)/;
    let matchpaymentImage = paymentImage.match(reg);
    if (!matchpaymentImage) {
      errors.push("هناك خطأ في الصورة التي تم تحميلها");
    }

    //Check if the order  method exist on DB
    const orderSearch = await OrderModel.findById(orderID);

    if (!orderSearch) errors.push("يبدو أن الطلب الذي اخترته غير مسجل لدينا");

    //Send any empty errors
    if (errors.length !== 0)
      return {
        status: false,
        errors,
      };

    return {
      status: true,
      orderID,
      paymentImage,
    };
  } catch (e) {
    return {
      status: false,
      errors: [e.message],
    };
  }
};
