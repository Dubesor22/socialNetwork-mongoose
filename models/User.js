const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: String,
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: String,
    confirmed: { type: Boolean, default: false },
    tokens: [],
    avatar: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
