const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const PostSchema = new mongoose.Schema(
  {
    comments: [
      {
        userId: {
          type: ObjectId,
          ref: "User",
        },
        comment: String,
      },
    ],
    userId: {
      type: ObjectId,
      ref: "User",
    },
    username: String,
    body: String,
  },

  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
