module.exports = async ({ name, protein, fat, energy, carbs }) => {
  try {
    let errors = [];

    //Required
    if (!name) errors.push("يجب وضع اسم للأكلة");
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

    return {
      status: true,
      name,
      protein,
      fat,
      energy,
      carbs
    };
  } catch (e) {
    return {
      status: false,
      errors: [e.message],
    };
  }
};
