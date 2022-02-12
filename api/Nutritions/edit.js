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

    if (!nutritionData._id) {
      return res.json({
        status: false,
        errors: ["يجب تحديد الأكلة التي تريد تعديلها"],
      });
    }


    const validateNutrition = await validation(nutritionData);
    if (!validateNutrition.status) {
      return res.json(validateNutrition);
    }

    /********************************************************/
    //Check if paymentMethod exist on DB
    let nutritionSearch = await nutritionModel.findOne({
      _id: nutritionData._id,
    });

    if (!nutritionSearch) {
      return res.json({
        status: false,
        errors: ["هذه الأكلة غير موجودة في قاعدة البيانات"],
      });
    }

    /********************************************************/
    //Edit the paymentMethod on DB
    const result = await nutritionModel.updateOne(
      { _id: nutritionData._id },
      {
        name: validateNutrition.name,
        protein: validateNutrition.protein,
        fat: validateNutrition.fat,
        energy: validateNutrition.energy,
        carbs: validateNutrition.carbs
      }
    );

    if (result.nModified === 0) {
      return res.json({
        status: false,
        errors: ["لم تقم بإجراء أي تغيير"],
      });
    }

    /********************************************************/
    //Get the new paymentMethod
    nutritionSearch = await nutritionModel.findOne({
      _id: nutritionData._id,
    });

    /********************************************************/
    //Send the success response
    return res.json({
      status: true,
      messages: ["تم تعديل الأكلة بنجاح"],
      nutrition: nutritionSearch,
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /Nutritions/edit, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
