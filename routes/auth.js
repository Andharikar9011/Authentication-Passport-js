const express = require("express");
const router = express.Router();
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const Authuser = require("../models/user");
const dotenv = require("dotenv");
dotenv.config();

//                        Google Auth                       //
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/dashboard",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/auth/dashboard");
  }
);

//                            FB auth                          //
router.get("/facebook", passport.authenticate("facebook"));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/auth/dashboard");
  }
);

//               Basic Login                   //
router.post("/normallogin", function (req, res, next) {
  Authuser.findOne({ username: req.body.username }, function (err, user) {
    if (err || !user) {
      console.log(err);
    } else {
      console.log(user);
      console.log(req.body);
      if (user.password == req.body.password) {
        res.render("dashboard", { title: "Dashboard" });
      } else {
        res.render("login");
      }
    }
  });
});
router.post("/normalregister", function (req, res, next) {
  const user = new Authuser({
    username: req.body.username,
    name: req.body.name,
    password: req.body.password,
  });
  console.log(user);
  user.save(function (err, user) {
    if (err || !user) {
      console.log(err);
      res.render("index");
    } else {
      console.log(user);
      res.render("dashboard", { title: "Dashboard" });
    }
  });
});

//                 Passport Local Stratergy                        //
router.post("/plregister", function (req, res, next) {
  Authuser.register(
    { username: req.body.username, name: req.body.name },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function () {
          console.log("reached here");
          res.redirect("/auth/dashboard");
        });
      }
    }
  );
});

router.get("/dashboard", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("dashboard", { title: "Dashboard" });
  } else {
    res.redirect("/auth/login");
  }
});

router.post("/pllogin", function (req, res, next) {
  console.log(req.body);
  const user = new Authuser({
    username: req.body.username,
    password: req.body.password,
  });
  console.log(user);
  req.login(user, function (err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/auth/dashboard");
      });
    }
  });
});
router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

//                    Page GET Routes                         //
router.get("/", function (req, res, next) {
  res.send("HI");
});
router.get("/login", function (req, res, next) {
  res.render("login");
});
router.get("/register", function (req, res, next) {
  res.render("register");
});

module.exports = router;
