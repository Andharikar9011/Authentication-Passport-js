const mongoose = require("mongoose");
const { Schema } = mongoose;
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
// const findOrCreate = require("mongoose-findorcreate");
const userSchema = new Schema({
  username: String,
  name: String,
  googleId: {
    type: String,
    unique: true,
  },
  facebookId: {
    type: String,
    unique: true,
  },
  twitterId: {
    type: String,
    unique: true,
  },
  githubId: {
    type: String,
    unique: true,
  },
  password: String,
  photo: String,
});
userSchema.plugin(passportLocalMongoose);
// userSchema.plugin(findOrCreate);
const authUser = mongoose.model("authUser", userSchema);

module.exports = authUser;
