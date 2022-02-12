const ImageCategoryModel = require("../models/ImageExercisesCategory");

module.exports = async ({ categoryId, title, description, files, edit = false }) => {
  try {
    let errors = [];

    //Required
    if (!edit && !(files && files.images.length !== 0))
      errors.push("يجب رفع صورة واحدة علي الأقل ");
    if (!categoryId) errors.push("يجب تحديد القسم");
    if (!title) errors.push("يجب وضع عنوان للتمرين");
    if (!description) errors.push("يجب كتابة وصف للتمرين");

    //Send any empty errors
    if (errors.length !== 0)
      return {
        status: false,
        errors,
      };

    /******************************************************/

    //Check if category exist
    let categorySearch = await ImageCategoryModel.findOne({ _id: categoryId });
    if (!categorySearch)
      return {
        status: false,
        errors: ["القسم الذي اخترته غير موجود في قاعدة البيانات"],
      };

    /******************************************************/

    //Length
    if (title.length <= 5) errors.push("العنوان قصير جدا");
    if (description.length <= 20) errors.push("وصف التمرين قصير جدا");

    //Image validation
    let images = (files && files.images) || [];
    if(!Array.isArray(images)) {
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

    //Send any errors
    if (errors.length !== 0)
      return {
        status: false,
        errors,
      };

    return {
      status: true,
      categoryId,
      title,
      description,
      images,
    };
  } catch (e) {
    return {
      status: false,
      errors: [e.message],
    };
  }
};
