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
   async like(req,res){
        try {
            const comments = await Comment.findById(req.params._id)
            if(!comments){
                return res.send('No hemos encontrado el comentario')
            }
            if(comments.likes.includes(req.user._id.toString())){
                return res.send('Ya le has dado el like a este comentario')
            }
            const comment = await Comment.findByIdAndUpdate(
                req.params._id,
                {$push:{likes:req.user._id.toString()}},
                {new:true}
            )
            await User.findByIdAndUpdate(
                req.user._id,
                {$push:{commentsLikes:req.params._id}},
                {new:true}
            )
            res.send(comment)
        } catch (error) {
            console.error(error)
            res.status(404).send('Introduce un id de formato correcto')
        }
    },
    async likeDown(req,res){
        try {
            const comments = await Comment.findById(req.params._id)
            if(!comments){
                return res.send('No hemos encontrado el comentario')
            }
            const users = await User.findById(req.user._id)
            if(!users.commentsLikes.includes(req.params._id)){
                return res.send('No le has dado el like al comentario')
            }
            await Comment.findByIdAndUpdate(
                req.params._id,
                {$pull:{likes:req.user._id}},
                {new:true}
            )
            const user = await User.findByIdAndUpdate(
                req.user._id,
                {$pull:{commentsLikes:req.params._id}},
                {new:true}
            )
            res.send(user)
        } catch (error) {
            console.error(error)
            res.status(404).send('Introduce un id de formato correcto')
        }
    }
};

module.exports = CommentController;
