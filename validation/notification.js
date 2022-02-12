require("dotenv/config");

module.exports = async ({ title, body }) => {
  try {
    let errors = [];

    if (!title) errors.push("يجب كتابة عنوان الإشعار");

    if (!body) errors.push("يجب كتابة  محتوي الإشعار ");

    //Send any empty errors
    if (errors.length !== 0)
      return {
        status: false,
        errors,
      };

    return {
      status: true,
      title,
      body,
    };
  } catch (e) {
    return {
      status: false,
      errors: [e.message],
    };
  }
};
