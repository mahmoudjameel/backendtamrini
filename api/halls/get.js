// @ts-nocheck
const express = require("express");
const router = express.Router();
const HallModel = require("../../models/Hall");

router.post("/", async (req, res) => {
  try {
    let halls = [];
    if (req.body._id) {
      let hallSearch = await HallModel.findOne({ _id: req.body._id });

      if (!hallSearch) {
        return res.json({
          status: false,
          errors: ["هذه القاعة غير مسجلة في قاعدة البيانات"],
        });
      }

      halls = [...halls, hallSearch.toObject()];
    } else {
      let hallsSearch = await HallModel.find({});

      if (hallsSearch.length === 0) {
        return res.json({
          status: false,
          errors: ["لا يوجد قاعات"],
        });
      }

      halls = [...halls, ...hallsSearch];
    }

    /********************************************************/
    //Edit the images to be urls
    let finalImages = [];
    for (hall of halls) {
      for (image of hall.images) {
        finalImages.push(
          `${req.protocol}://${req.headers.host}/images/halls/${image}`
        );
      }
      hall.images = finalImages;
      finalImages = [];
    }

    return res.json({
      status: true,
      halls,
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /halls/get, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

router.post("/near", async (req, res) => {
  try {
    const { lng, lat } = req.body;
    if (!lat || !lng) {
      return res.json({
        status: false,
        errors: ["يجب تحديد موقع المستخدم"],
      })
    }

    let halls = await HallModel.aggregate().near({
      near: { type: "Point", coordinates: [Number(lng), Number(lat)] },
      distanceField: "dis",
      distanceMultiplier: 0.001,
      spherical: true
    });

    if (halls.length === 0) {
      return res.json({
        status: false,
        errors: ["لا يوجد قاعات"],
      });
    }

    /********************************************************/
    //Edit the images to be urls
    let finalImages = [];
    for (hall of halls) {
      for (image of hall.images) {
        finalImages.push(
          `${req.protocol}://${req.headers.host}/images/halls/${image}`
        );
      }
      hall.images = finalImages;
      finalImages = [];
    }

    return res.json({
      status: true,
      halls,
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /halls/get, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
