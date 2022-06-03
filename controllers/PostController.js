const Post = require("../models/Post");
const User = require("../models/User.js");

const PostController = {
  async create(req, res) {
    try {
      const post = await Post.create({
        ...req.body,
        userId: req.user._id,
        username: req.user.username,
      });
      await User.findByIdAndUpdate(req.user._id, {
        $push: { postIds: post._id },
      });
      res.status(201).send(post);
    } catch (error) {
      console.error(error);
    }
  },

  async getAll(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const posts = await Post.find()
        .populate("commentIds")
        .limit(limit * 1)
        .skip((page - 1) * limit);
      res.send(posts);
    } catch (error) {
      console.error(error);
    }
  },

  async getById(req, res) {
    try {
      const post = await Post.findById(req.params._id);
      res.send(post);
    } catch (error) {
      console.error(error);
    }
  },

  async getPostsByUserName(req, res) {
    try {
      if (req.params.username.length > 20) {
        return res.status(400).send("Busqueda demasiado larga");
      }
      const username = new RegExp(req.params.username, "i");
      const post = await Post.find({ username });
      res.send(post);
    } catch (error) {
      console.log(error);
    }
  },

  async delete(req, res) {
    try {
      const post = await Post.findByIdAndDelete(req.params._id);
      res.send({ post, message: "Post deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "there was a problem trying to remove the publication",
      });
    }
  },

  // async delete(req, res) {
  //   try {
  //     const post = await Post.deleteMany(req.params.username);
  //     res.send({ post, message: "Posts deleteds" });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).send({
  //       message: "there was a problem trying to remove the publication",
  //     });
  //   }
  // },

  async update(req, res) {
    try {
      const post = await Post.findByIdAndUpdate(req.params._id, req.body, {
        new: true,
      });
      res.send({ message: "post successfully updated", post });
    } catch (error) {
      console.error(error);
    }
  },

  async like(req, res) {
    try{
      const post = await Post.findOneAndUpdate({_id: req.params._id, likes: {$nin: req.user._id} } , {
        $push: { likes: req.user._id },
      }, {new: true});
      if(post === null){
        res.send({ message: "ya le has dado a like chavalote"})
      }
      res.send({ message: "you liked", post });

    } catch (error) {
      console.log(error);
    }
  },

  async dislike(req, res) {
    try{
      const post = await Post.findByIdAndUpdate(req.params._id , {
        $pull: { likes: req.user._id } 
      }, {new: true});
       
      res.send({ message: "you disliked", post });

    } catch (error) {
      console.log(error);
    }
  },

};
module.exports = PostController;
