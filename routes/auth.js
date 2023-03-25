const express = require("express");
const router = express.Router();
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const Authuser = require("../models/user");
const jwt = require("jsonwebtoken");
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
  passport.authenticate("google", { failureRedirect: "/auth/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/auth/dashboard");
  }
);

//                            FB auth                          //
router.get("/facebook", passport.authenticate("facebook"));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/auth/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/auth/dashboard");
  }
);

//               Basic Login                   //
// router.post("/normallogin", function (req, res, next) {
//   Authuser.findOne({ username: req.body.username }, function (err, user) {
//     if (err || !user) {
//       console.log(err);
//       res.render("register");
//     } else {
//       // console.log(user);
//       // console.log(req.body);
//       if (user.password == req.body.password) {
//         console.log("password matches");
//         req.user = user;
//         console.log(req.user);
//         res.user = user;
//         res.redirect("/auth/dashboard");
//       } else {
//         req.user = user;
//         res.render("register");
//       }
//     }
//   });
// });
// router.post("/normalregister", function (req, res, next) {
//   const user = new Authuser({
//     username: req.body.username,
//     name: req.body.name,
//     password: req.body.password,
//   });
//   console.log(user);
//   user.save(function (err, user) {
//     if (err || !user) {
//       console.log(err);
//       res.render("index");
//     } else {
//       console.log(user);
//       req.user = user;
//       res.redirect("/auth/dashboard");
//     }
//   });
// });

//                 Passport Local Stratergy                        //
router.post("/plregister", function (req, res, next) {
  Authuser.register(
    { username: req.body.username, name: req.body.name },
    req.body.password,
    function (err, user) {
      req.user = user;
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function () {
          // console.log("reached here");
          res.redirect("/auth/dashboard");
        });
      }
    }
  );
});
router.get("/dashboard", async (req, res) => {
  console.log(req.user, res.user, "User here");
  const result = await Authuser.findOne({ _id: req.user._id });
  console.log(result);
  const token = jwt.sign(req.user._id, process.env.EXPRESS_SESSION_SECRET);
  console.log(token);
  if (req.isAuthenticated()) {
    res.cookie("token", token);
    res.render("dashboard", {
      title: "Dashboard",
      userid: req.user._id,
      secrets: result.secrets,
    });
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
