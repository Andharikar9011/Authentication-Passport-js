const passport = require("passport");
const GoogleStrategy = require("passport-google-oidc");
const dotenv = require("dotenv");
dotenv.config();
passport.use(
  new GoogleStrategy(
    {
      // options
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/redirect",
      scope: ["profile"],
    },
    (accessToken, refreshToken, profile, done) => {
      //callback
      console.log(accessToken, refreshToken, profile, done);
    }
  )
);
