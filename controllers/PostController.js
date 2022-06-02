const Post = require("../models/Post");

const PostController = {
  async create(req, res) {
    try {
      const post = await Post.create({
        body: req.body.body,
        userId: req.user._id,
        username: req.user.username,
      });
      // await user.findByIdAndUpdate(
      //   req.user,
      //   { $push: { posts: { ...req.body, userId: req.user._id } } },
      //   { new: true }
      // );

      res.status(201).send(post);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "Ha habido un problema al crear el posto" });
    }
  },

  async getAll(req, res) {
    try {
      const posts = await Post.find();
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
};
module.exports = PostController;
