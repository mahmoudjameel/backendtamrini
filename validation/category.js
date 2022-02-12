
module.exports = async ({ name, files }) => {
  try {
    let errors = [];

    //Required
    if (!(files && files.image)) errors.push("يجب رفع صورة للقسم");
    if (!name) errors.push("يجب وضع اسم للقسم");

    //Send any empty errors
    if (errors.length !== 0)
      return {
        status: false,
        errors,
      };

    //Image validation
    let image = files.image;
    let extention = image.name.split(".").pop();

    if (!["png"].includes(extention))
      errors.push("يجب أن يكون امتداد الصورة png فقط");

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
    return {
      status: false,
      errors: [e.message],
    };
  }
};
