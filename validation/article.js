module.exports = async ({ title, content, files, edit = false }) => {
  try {
    let errors = [];

    //Required
    if (!edit && !(files && files.mainImage))
      errors.push("يجب رفع صورة للمقال");
    if (!title) errors.push("يجب وضع عنوان للمقال");
    if (!content) errors.push("يجب كتابة محتوي المقال");

    //Send any empty errors
    if (errors.length !== 0)
      return {
        status: false,
        errors,
      };

    //Length
    if (title.length <= 10) errors.push("العنوان قصير جدا");
    if (content.length <= 50) errors.push("محتوي المقال قصير جدا");

    //Image validation
    let mainImage = (files && files.mainImage) || [];
    if (!Array.isArray(mainImage)) {
      mainImage = [mainImage];
    }
    //add the extension property to the image
    mainImage = mainImage.map((image) => {
      image.extension = image.name.split(".").pop();
      return image;
    });

    for (let image of mainImage) {
      if (!["jpg", "png", "jpeg"].includes(image.extension)) {
        errors.push("يجب أن يكون امتداد الصور png أو jpeg أو jpg فقط");
        break;
      }
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
      content,
      mainImage,
    };
  } catch (e) {
    return {
      status: false,
      errors: [e.message],
    };
  }
};
