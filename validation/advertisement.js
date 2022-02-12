var validUrl = require('valid-url');

module.exports = async ({ files, link, edit = false }) => {
  try {
    let errors = [];

    //Required
    if(edit == false) {
      if (!(files && files.image)) errors.push("يجب رفع صورة الاعلان");
    }
    if(link) {
      if(!(validUrl.isWebUri(link))) errors.push("الرابط الذي أدخلته غير صالح")
    }

    //Send any empty errors
    if (errors.length !== 0)
      return {
        status: false,
        errors,
      };

    let image = null;
    if (files && files.image) {
      //Image validation
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
      image,
      link
    };
  } catch (e) {
    console.log(`Error in /validation/advertisement, error: ${e.message}`, e);

    return {
      status: false,
      errors: [e.message],
    };
  }
};
