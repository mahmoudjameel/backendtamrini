const express = require("express");
const router = express.Router();
const nutritionModel = require("../../models/nutritions");
const validation = require("../../validation/nutrition");

router.post("/", async (req, res) => {
  try {
    //Check for permissions
    if (!(req.user && req.user.role === "admin")) {
      return res.json({
        status: false,
        errors: ["ليس لديك صلاحية الوصول الي هذه البيانات"],
      });
    }

    const nutritionData = req.body;

    const validateNutrition = await validation(nutritionData);
    if (!validateNutrition.status) {
      return res.json(validateNutrition);
    }

    /********************************************************/

    //Save the payment method to DB
    const saveNutritionMethod = await nutritionModel.create({
      name: validateNutrition.name,
      protein: validateNutrition.protein,
      fat: validateNutrition.fat,
      energy: validateNutrition.energy,
      carbs: validateNutrition.carbs
    });

    if (!saveNutritionMethod) {
      return res.json({
        status: false,
        errors: ["حدث خطأ غير متوقع ، يرجي المحاولة فيما بعد"],
      });
    }

    /********************************************************/

    //Send the success response
    return res.json({
      status: true,
      messages: ["تم اضافة الاكلة بنجاح"],
      nutrition: saveNutritionMethod,
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /Nutritions/add, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
