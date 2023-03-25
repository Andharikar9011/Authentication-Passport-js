const express = require("express");
const router = express.Router();
const Authuser = require("../models/user");
const jwt = require("jsonwebtoken");

/* GET users listing. */
router.post("/secrets", function (req, res, next) {
  const decoded = jwt.verify(
    req.cookies.token,
    process.env.EXPRESS_SESSION_SECRET
  );
  console.log(decoded);
  Authuser.findOneAndUpdate(
    { _id: decoded },
    { $push: { secrets: req.body.secret } },
    (err, result) => {
      if (err || !result) {
        console.log(err);
      } else {
        req.user._id = result._id;
        res.redirect("/auth/dashboard");
      }
    }
  );
});

module.exports = router;
