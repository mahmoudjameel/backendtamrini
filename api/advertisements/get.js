const express = require("express");
const router = express.Router();
const AdvertisementModel = require("../../models/Advertisement");

router.post("/", async (req, res) => {
  try {
    let ads = await AdvertisementModel.find({});

    if (ads.length === 0) {
      return res.json({
        status: false,
        errors: ["لا يوجد اعلانات لعرضها"],
      });
    }

    /********************************************************/
    //Edit the image to be url
    ads.map((ad) => {
      ad.image = `${req.protocol}://${req.headers.host}/images/ads/${ad.image}`;
    });

    return res.json({
      status: true,
      advertisements: ads,
    });

    /********************************************************/
  } catch (e) {
    console.log(`Error in /advertisements/get, error: ${e.message}`, e);
    res.json({
      status: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
