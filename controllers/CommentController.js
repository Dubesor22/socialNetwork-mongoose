const Comment = require("../models/Comment");

const CommentController = {
  async insertComment(req, res) {
    try {
      const comment = await Comment.findByIdAndUpdate(
        req.params._id,
        { $push: { comments: { ...req.body, userId: req.user._id } } },
        { new: true }
      );
      res.send(comment);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "There was a problem with your review" });
    }
  },
};

module.exports = CommentController;
