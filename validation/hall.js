require("dotenv/config");

module.exports = async ({
  files,
  name,
  city,
  brief,
  subscriptions,
  lat,
  lng,
}) => {
  try {
    let errors = [];

    //Required
    if (!(files && files.images.length !== 0))
      errors.push("يجب رفع صورة واحدة علي الأقل");
    if (!name) errors.push("يجب كتابة اسم القاعة");
    if (!city) errors.push("يجب كتابة اسم المدينة الموجودة بها القاعة");
    if (!brief) errors.push("يجب كتابة نبذة عن القاعة");
    if (
      subscriptions &&
      (subscriptions.length === 0 ||
        !subscriptions[0].name ||
        !subscriptions[0].price)
    )
      errors.push("يجب كتابة أنواع الاشتراكات");
    if (!(lat && lng)) errors.push("يجب تحديد مكان القاعة علي الخريطة");

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
      city,
      brief,
      subscriptions,
      lat,
      lng,
      images,
    };
  } catch (e) {
    return {
      status: false,
      errors: [e.message],
    };
  }
};
