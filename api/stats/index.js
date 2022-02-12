const express = require("express");
const router = express.Router();

router.use("/all", require("./all"));


module.exports = router;
