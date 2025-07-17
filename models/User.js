const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/nayaappforgolus");

const userSchema = mongoose.Schema({
  username: String,
  email: String,
  fullName: String,
  dp: String,
  posts: [],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.plugin(plm);

module.exports = mongoose.model("User", userSchema);
