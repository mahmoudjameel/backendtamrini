const express = require("express");
const router = express.Router();

router.use("/send", require("./send"));
router.use("/save", require("./save"));

module.exports = router;
