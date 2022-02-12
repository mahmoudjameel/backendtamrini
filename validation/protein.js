const ProteinCategory = require("../models/ProteinCategory");

module.exports = async ({ categoryId, name, description, files, edit = false }) => {
  try {
    let errors = [];

    //Required
    if (!edit && !(files && files.mainImage)) errors.push("يجب رفع صورة للمكمل الغذائي");
    if (!name) errors.push("يجب وضع عنوان للمكمل الغذائي");
    if (!description) errors.push("يجب كتابة وصف المكمل الغذائي ");
    if (!categoryId) errors.push("يجب تحديد القسم");

    //Send any empty errors
    if (errors.length !== 0)
      return {
        status: false,
        errors,
      };

    //Check if category exist
    let categorySearch = await ProteinCategory.findOne({ _id: categoryId });
    if (!categorySearch)
      return {
        status: false,
        errors: ["القسم الذي اخترته غير موجود في قاعدة البيانات"],
      };

    //Length
    if (description.length <= 50) errors.push("وصف المكمل الغذائي قصير جدا");

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
      description,
      mainImage,
      categoryId
    };
  } catch (e) {
    return {
      status: false,
      errors: [e.message],
    };
  }
};
