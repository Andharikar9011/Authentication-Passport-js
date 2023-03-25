const express = require("express");
const router = express.Router();

/* GET users listing. */
router.get("/privacy", function (req, res, next) {
  res.send("Privacy Policy");
});

router.get("/termsandconditions", function (req, res, next) {
  res.send("Terms and Conditions");
});

router.get("/datadeletion", function (req, res, next) {
  res.send("data deletion policy");
});

module.exports = router;
