const express = require("express");
const router = express.Router();

router.use("/add", require("./add"));
router.use("/edit", require("./edit"));
router.use("/get", require("./get"));
router.use("/myarticles", require("./Myarticle"));
router.use("/delete", require("./delete"));

module.exports = router;
