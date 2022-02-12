const express = require("express");
const router = express.Router();

router.use("/register", require("./register"));
router.use("/login", require("./login"));
router.use("/edit", require("./edit"));
router.use("/get", require("./get"));
router.use("/delete", require("./delete"));
router.use("/like", require("./like"));

module.exports = router;
