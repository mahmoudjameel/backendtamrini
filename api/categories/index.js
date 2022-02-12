const express = require("express");
const router = express.Router();

/**
 * @param type
 * 1 --> image categories
 * 2 --> video categories
 * 
*/

router.use("/add", require("./add"));
router.use("/edit", require("./edit"));
router.use("/get", require("./get"));
router.use("/delete", require("./delete"));

module.exports = router;
