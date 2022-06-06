const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;
const { isEmail } = require("validator");

const UserSchema = new mongoose.Schema(
  {
    name: String,
    username: { type: String, required: true, min: 3, max: 25 },
    password: { type: String, required: true, min: 3, max: 50 },
    email: {
      type: String,
      required: true,
      unique: true,
      max: 50,
      validate: [isEmail, "no es Un email Valido"],
    },
    role: String,
    confirmed: { type: Boolean, default: true },
    tokens: [],
    avatar: { type: String, default: "" },
    postIds: [{ type: ObjectId, ref: "Post" }],
    isAdmin: { type: Boolean, default: false },
    followers: [{ type: ObjectId }],
  },
  { timestamps: true }
);

UserSchema.methods.toJSON = function () {
  const user = this._doc;
  delete user.tokens;
  delete user.password;
  return user;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
