const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;
const { isEmail } = require("validator");

const UserSchema = new mongoose.Schema(
  {
    name: String,
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [isEmail, "no es Un email Valido"],
    },
    role: String,
    confirmed: { type: Boolean, default: false },
    tokens: [],
    avatar: String,
    postIds: [{ type: ObjectId, ref: "Post" }],
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
