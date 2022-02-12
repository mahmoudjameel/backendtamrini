const express = require("express");
const router = express.Router();

router.use("/add", require("./add"));
router.use("/edit", require("./edit"));
router.use("/get", require("./get"));
router.use("/delete", require("./delete"));
router.use("/uploadImage", require("./uploadImage"));
router.use("/addinfo", require("./addinfo"));
module.exports = router;
