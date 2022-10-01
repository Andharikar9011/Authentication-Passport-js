const express = require("express");
const router = express.Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oidc");
const Authuser = require("../models/user");
const dotenv = require("dotenv");
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env["GOOGLE_CLIENT_ID"],
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
      callbackURL: "/auth/google/redirect",
      passReqToCallback: true,
      scope: ["profile", ["email"]],
    },
    function verify(req, accessToken, refreshToken, profile, done) {
      console.log(accessToken, refreshToken, profile);
      if (!req.user) {
        Authuser.findOne(
          {
            userid: refreshToken.emails[0].value,
          },
          function (err, user) {
            if (err) {
              return done(err);
            }
            if (user) {
              return done(null, user);
            } else {
              const user = new Authuser();
              user.userid = refreshToken.emails[0].value;
              user.name = refreshToken.displayName;
              user.save(function (err) {
                if (err) {
                  throw new ERROR("Error saving new user: " + err);
                }

                return done(null, user);
              });
            }
          }
        );
      } else {
        return done(null, req.user);
      }
    }
  )
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.username, name: user.name });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

router.get("/login", function (req, res, next) {
  res.render("login");
});

router.get("/logout", function (req, res, next) {
  res.render("logout");
});

router.get("/google", passport.authenticate("google"));

router.get(
  "/google/redirect",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
  }),
  (req, res) => {
    // console.log(data);
    res.send("hi");
  }
);

router.get("/github", function (req, res, next) {
  res.send("HI");
});

router.get("/", function (req, res, next) {
  res.send("HI");
});

module.exports = router;
