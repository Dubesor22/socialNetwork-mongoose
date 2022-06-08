const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const  jwt_secret  = process.env.JWT_SECRET
const transporter = require("../config/nodemailer");
const path = require("path");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
// const { post } = require("../routes/users");



const UserController = {
  async create(req, res, next) {
    try {
      if (!req.body.password) {
        return res.status(400).send({ message: "Password required" });
      }

      req.body.role = "user"; // Assing role by default
      req.body.password = bcrypt.hashSync(req.body.password, 10);
      // req.body.active = true;
      req.body.confirmed = true;

      const user = await User.create({ ...req.body });
      const emailToken = jwt.sign({ email: req.body.email }, jwt_secret, {
        expiresIn: "48h",
      });
      const url = "http://localhost:8080/users/confirm/" + emailToken;
      // await transporter.sendMail({
      //   to: req.body.email,
      //   subject: "Confirme su registro",
      //   html: `<h3>Bienvenido, estás a un paso de registrarte </h3>
      //     <a href="${url}"> Click para confirmar tu registro</a>
      //     Este enlace Caduca en 48 horas.
      //     `,
      // });
      // 🚨🚨🚨port 465 is currently closed🚨🚨🚨
      res.status(201).send({
        message: "We have sent a mail to confirm the registration",
        user,
      });
    } catch (err) {
      err.origin = "usuario ";
      next(err);
    }
  },

  async confirm(req, res, next) {
    try {
      const token = req.params.emailToken;
      const payload = jwt.verify(token, jwt_secret);

      await User.updateOne({ email: payload.email }, { confirmed: true });

      res.status(201).send("User confirmed");
    } catch (error) {
      error.origin = "User Confirm";
      next(error);
    }
  },

  async updateUser(req, res, next) {
    try {
      // Dont' allow to update 'role':
      req.body.role = req.user.role;

      // Hash password, if updated:
      if (req.body.password !== undefined) {
        req.body.password = bcrypt.hashSync(req.body.password, 10);
      }
      req.body.active = true;

      // If there is an avatar, get the filename
      if (req.file) {
        req.body.avatar = req.file.filename;
      }

      const result = await User.findByIdAndUpdate(req.user._id, {
        avatar: req.file.originalname,
      });

      if (result) {
        return res.send({ message: "User updated successfully", result }),{new: true};
      } else {
        return res.send({ message: "Can't update user" });
      }
     
    } catch (err) {
      err.origin = "User Update";
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const user = await User.findOne({
        email: req.body.email,
      });
      if (!user.confirmed) {
        return res.send({ message: "confirm your email frist" });
      }
      const token = jwt.sign({ _id: user._id }, jwt_secret);
      if (user.tokens.length > 4) user.tokens.shift();
      user.tokens.push(token);
      await user.save();
      res.send({ message: "Bienvenid@ " + user.username, token, user });
    } catch (err) {
      err.origin = "User login";
      next(err);
    }
  },

  async getUser(req, res, next) {
    try {
      const user = await User.findById(req.user._id).populate("postIds")
      res.send(user);
    } catch (error) {
      err.origin = "User get";
      next(error);
    }
  },
  async deleteUser(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.user._id);

     await Comment.deleteMany({userId:req.user._id})
      await Post.deleteMany({postIds:req.user.postIds})
     
    
      res.send({user,post, message: "User deleted successfully" });
    } catch (error) {
      err.origin("user Delete")
      res.status(500).send({message: "User delete error"});
      next(error);
    }
  },

  async deleteUserById(req, res, next) {
    try {
      
      const users = await User.findById(req.params._id);
      if (!users) {
        return res.send("No User Found");
      }
      const user = await User.findByIdAndDelete(req.params._id);
      const posts = await Post.find({ userId: req.params._id });
      await Post.deleteMany({ userId: req.params._id });
      await Comment.deleteMany({ userId: req.params._id });

      posts.forEach(async (post) => {
        await Comment.deleteMany({ postId: post._id });
        // const userss = await User.find({ favorites: post._id });
        // userss.forEach(async (user) => {
        //   await User.findByIdAndUpdate(
        //       user._id, 
        //       {$pull: { favorites: req.params._id }}
        //     );
        // });
      });

      // const commentslike = await User.find({commentsLikes:req.params._id})
      // commentslike.forEach(async clikes=>{
      // await User.findByIdAndUpdate(
      //     clikes._id,
      //     {$pull:{commentsLikes:req.params._id}}
      //   );
      // });

      const followers = await User.find({follower:req.params._id});
      followers.forEach(async (follower) => {
      await User.findByIdAndUpdate(
          follower._id,
          {$pull: { followers: req.params._id }}
        );
      });

      const followings = await User.find({ followings: req.params._id });
      followings.forEach(async (follow) => {
        await User.findByIdAndUpdate(
          follow._id, 
          {$pull: { followings: req.params._id },
        });
      });

      res.status(200).send({ message: "Fulminated" ,user});
    } catch (error) {
      err.origin("user Delete")
      res.status(500).send({message: "User delete error"});
      next(error);
    }
  },



  async deleteAllUsers(req, res) {
    try {
      const user = await User.deleteMany({});
      res.send({ user, message: "All Users has been deleted." });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "there was a problem trying to remove the users",
      });
    }
  },
  async logout(req, res) {
    try {
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { tokens: req.headers.authorization },
      });
      res.send({ message: "Desconectado con éxito" });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "there was a problem trying to logout"
      });
    }
  },

  async follow(req, res) {
        try {
          const exist = await User.findById(req.params._id)
          if (!exist.followers.includes(req.user._id)){
          const user = await User.findByIdAndUpdate(
            req.params._id,
            { $push: {followers: req.user._id }},
            { new: true }     
          );
          res.send({message: "you followed!!", user});
        }
        else {
          res.status(400).send({message: "You can't follow twice"})
        }
        } catch (error) {
          res.status(500).send({message: "There is a Problem with the controller" });
        }
      },

       async removeFollow(req, res) {
        try {
          const exist = await User.findById(req.params._id)
          if (exist.followers.includes(req.user._id)){
          const user = await User.findByIdAndUpdate(
            req.params._id,
            { $pull: {followers: req.user._id}},
            { new: true }
          );
          res.status(200).send({message: 'follow removed', user});
        }
        else {
          res.status(400).send({message: "You cant remove a follow that you dont have"})
        }
        } catch (error) {
          res.status(500).send({message: "There is a Problem with the controller" });
        }
      },
};

module.exports = UserController;
