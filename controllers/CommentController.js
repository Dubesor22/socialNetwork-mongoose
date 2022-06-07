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

  async getAll(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const comments = await Comment.find()
        .limit(limit * 1)
        .skip((page - 1) * limit);
      res.send(comments);
    } catch (error) {
      console.error(error);
    }
  },

  async delete(req, res) {
    try {
      const comment = await Comment.findByIdAndDelete(req.params._id);
      res.send({comment, message: "Comment deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "there was a problem trying to remove the comment",
      });
    }
  },

    async deleteForAdmin(req, res) {
    try {
      const comment = await Comment.findByIdAndDelete(req.params._id);
      res.send({comment, message: "Comment deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "there was a problem trying to remove the comment",
      });
    }
  },
};

module.exports = CommentController;
