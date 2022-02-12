require("dotenv/config");

module.exports = async ({
  files,
  name,
  ingredients,
  foodValue,
  preparation,
}) => {
  try {
    let errors = [];

    //Required
    if (!(files && files.images.length !== 0))
      errors.push("يجب رفع صورة واحدة علي الأقل");
    if (!name) errors.push("يجب كتابة اسم الاكلة");
    if (!ingredients) errors.push("يجب كتابة المكونات الاكلة ");
    if (!foodValue) errors.push("يجب كتابة القيمة الغذائية ");
    if (!preparation) errors.push("يجب كتابة طريقة التحضير");

    //Send any empty errors
    if (errors.length !== 0)
      return {
        status: false,
        errors,
      };

    //Image validation
    let images = (files && files.images) || [];
    if (!Array.isArray(images)) {
      images = [images];
    }
    //add the extension property to the image
    images = images.map((image) => {
      image.extension = image.name.split(".").pop();
      return image;
    });

    for (let image of images) {
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
      name,
      ingredients,
      foodValue,
      preparation,
      images,
    };
  } catch (e) {
    return {
      status: false,
      errors: [e.message],
    };
  }
};
