module.exports = async ({ title, files, edit = false }) => {
  try {
    let errors = [];

    //Required
    if (!edit && !(files && files.mainImage)) {
      errors.push("يجب رفع صورة للمنتج");
    }
    if (!title) errors.push("يجب وضع عنوان للمنتج");

    //Send any empty errors
    if (errors.length !== 0)
      return {
        status: false,
        errors,
      };

    //Image validation
    let mainImage = null;
    if (files && files.mainImage) {
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
      mainImage,
    };
  } catch (e) {
    console.log(`Error in /validation/product-categories, error: ${e.message}`, e);

    return {
      status: false,
      errors: [e.message],
    };
  }
};
