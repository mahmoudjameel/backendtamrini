module.exports = async ({ title, description, price, coachBrief, files, categoryId, edit = false }) => {
  try {
    let errors = [];

    //Required
    if (!edit && !(files && files.mainImage)) errors.push("يجب رفع صورة للمنتج");
    if (!title) errors.push("يجب وضع عنوان للمنتج");
    if (!description) errors.push("يجب كتابة تفاصيل المنتج");
    if (!price) errors.push("يجب تحديد سعر المنتج");
    if (!categoryId) errors.push("يجب تحديد قسم المنتج");

    //Send any empty errors
    if (errors.length !== 0)
      return {
        status: false,
        errors,
      };

    //Length
    if (description.length <= 50) errors.push("وصف المنتج قصير جدا");

    let mainImage = null;
    if (files && files.mainImage) {
      //Image validation
      mainImage = files.mainImage;
      let extention = mainImage.name.split(".").pop();

      if (!["jpg", "png", "jpeg"].includes(extention))
        errors.push("يجب أن يكون امتداد الصورة png أو jpeg أو jpg فقط");
    }

    //Send any empty errors
    if (errors.length !== 0)
      return {
        status: false,
        errors,
      };

    return {
      status: true,
      title,
      description,
      price,
      coachBrief,
      mainImage,
      categoryId: Number(categoryId)
    };
  } catch (e) {
    console.log(`Error in /validation/product, error: ${e.message}`, e);

    return {
      status: false,
      errors: [e.message],
    };
  }
};
