module.exports = async ({ name, files, edit = false }) => {
  try {
    let errors = [];

    //Required
    if (!edit && !(files && files.image)) {
      errors.push("يجب رفع صورة للمنتج");
    }
    if (!name) errors.push("يجب وضع عنوان للمنتج");

    //Send any empty errors
    if (errors.length !== 0)
      return {
        status: false,
        errors,
      };

    //Image validation
    let image = null;
    if (files && files.image) {
      image = files.image;
      let extention = image.name.split(".").pop();

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
      name,
      image,
    };
  } catch (e) {
    console.log(`Error in /validation/product-categories, error: ${e.message}`, e);

    return {
      status: false,
      errors: [e.message],
    };
  }
};
