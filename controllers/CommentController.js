const Comment = require("../models/Comment");
const Post = require("../models/Post");

const CommentController = {
  async create(req, res) {
    try {
      const comment = await Comment.create({
        ...req.body,
        userId: req.user._id,
        postId: req.params._id,
      });
      await Post.findByIdAndUpdate(req.params._id, {
        $push: { commentIds: comment._id },
      });
      res.status(201).send(comment);
    } catch (error) {
      console.error(error);
    }
  },

  async update(req, res) {
    try {
      const comment = await Comment.findByIdAndUpdate(
        req.params._id,
        { ...req.body, userId: req.user._id },
        {
          new: true,
        }
      );
      res.send({ message: "comment successfully updated", comment });
    } catch (error) {
      console.error(error);
    }
  },
};

module.exports = CommentController;
