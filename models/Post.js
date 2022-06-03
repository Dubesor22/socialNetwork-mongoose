const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      required: true,
      ref: "User",
    },
    username: String,
    body: String,
    commentIds: [{ type: ObjectId, ref: "Comment" }],
    likes:  [{ type: ObjectId, ref: "User" }],
  },


  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
