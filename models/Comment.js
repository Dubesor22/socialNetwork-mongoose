const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    username: String,
    body: String,
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
