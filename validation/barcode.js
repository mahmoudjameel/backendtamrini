module.exports = async ({
  name,
  code,
  type,
  protein,
  fat,
  energy,
  carbs,
  weight,
  files,
}) => {
  try {
    let errors = [];

    //Required
    if (!(files && files.mainImage)) errors.push("يجب رفع صورة للمنتج");
    if (!name) errors.push("يجب وضع اسم للمنتج");
    if (!code) errors.push("يجب كتابة الباركود  للمنتج");
    if (!type) errors.push("يجب كتابة نوع  الباركود  للمنتج");

    if (!weight) errors.push("يجب كتابة الوزن  ");
    if (!protein && protein != 0) errors.push("يجب كتابة قيمة البروتين ");
    if (!fat && fat != 0) errors.push("يجب كتابة قيمة الذهنيات ");
    if (!energy && energy != 0) errors.push("يجب كتابة القيمة الطاقية ");
    if (!carbs && carbs != 0) errors.push("يجب كتابة قيمة الكربوهيدرات ");

    //Send any empty errors
    if (errors.length !== 0)
      return {
        status: false,
        errors,
      };

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
      name,
      code,
      type,
      protein,
      fat,
      energy,
      carbs,
      weight,
      mainImage,
    };
  } catch (e) {
    return {
      status: false,
      errors: [e.message],
    };
  }
};
