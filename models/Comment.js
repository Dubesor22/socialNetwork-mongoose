const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const CommentSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      ref: "User",
    },
    // commentDate: Date,
    postId: { type: ObjectId, ref: "Post" },
    text: { type: String, required: true },
    likes:[{type:ObjectId,ref:'User'}],
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
