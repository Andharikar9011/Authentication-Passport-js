const dotenv = require("dotenv");
dotenv.config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");

const passport = require("passport");

const mongoose = require("mongoose");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const policyRouter = require("./routes/policies");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const app = express();
const authUser = require("./models/user");
// Prints "MongoServerError: bad auth Authentication failed."

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// Using Sessions
app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);
app.use(passport.initialize());
app.use(passport.session());
// app.use(passport.authenticate("session"));
passport.use(authUser.createStrategy());
// passport.use(User.createStrategy());
passport.serializeUser((user, done) => {
  done(null, user);
});

// Used to decode the received cookie and persist session
passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // callbackURL: "http://localhost:3000/auth/google/dashboard",
      callbackURL: process.env.APP_URL.concat("auth/google/dashboard"),
      // userProfileURL: "http://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (req, accessToken, refreshToken, profile, cb) {
      // console.log("in stratergy");
      // console.log(profile);
      authUser.findOne({ googleId: profile.id }, function (err, user) {
        if (user) {
          return cb(null, user);
        } else {
          if (!user || err) {
            const user = new authUser({
              googleId: profile.id,
              username: profile.emails[0].value,
              name: profile.displayName,
              photo: profile.photos[0].value,
            });
            user.save(function (err, user) {
              if (err || !user) {
                return cb(err);
              }
              return cb(null, user);
            });
          }
        }
      });
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.APP_URL.concat("auth/facebook/callback"),
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log("in stratergy");
      console.log(profile);
      authUser.findOne({ facebookId: profile.id }, function (err, user) {
        if (user) {
          return cb(null, user);
        } else {
          if (!user || err) {
            const user = new authUser({
              facebookId: profile.id,
              username: profile.username,
              name: profile.displayName,
              photo: profile.profileUrl,
            });
            user.save(function (err, user) {
              if (err || !user) {
                return cb(err);
              }
              return cb(null, user);
            });
          }
        }
      });
    }
  )
);

mongoose
  .connect(process.env["MONGO_URI"], {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected sucessfully");
  })
  .catch((err) => console.log(err));

// using passport for google

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/policy", policyRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
