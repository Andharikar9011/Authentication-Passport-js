const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  userid: String,
  name: String,
  password: String,
});
const authUser = mongoose.model("authUser", userSchema);
module.exports = authUser;
