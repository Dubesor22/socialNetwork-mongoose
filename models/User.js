const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: String,
    password: String,
    email: String,
    confirmed: Boolean,
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
