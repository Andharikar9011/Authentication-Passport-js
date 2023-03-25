const mongoose = require("mongoose");
const { Schema } = mongoose;
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
// const findOrCreate = require("mongoose-findorcreate");
const userSchema = new Schema({
  username: String,
  name: String,
  googleId: String,
  facebookId: String,
  password: String,
  photo: String,
  secrets: {
    type: Array,
  },
});
userSchema.plugin(passportLocalMongoose);
// userSchema.plugin(findOrCreate);
const authUser = mongoose.model("authUser", userSchema);

module.exports = authUser;
