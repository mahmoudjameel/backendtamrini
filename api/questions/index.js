const express = require("express");
const router = express.Router();

router.use("/add", require("./add"));
// router.use("/edit", require("./edit"));
router.use("/get", require("./get"));
router.use("/answer", require("./answer"));
router.use("/like", require("./like"));
router.use("/delete", require("./delete"));
router.use("/deleteAnswer", require("./deleteAnswer"));

module.exports = router;
