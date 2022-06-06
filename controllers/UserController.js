const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const  jwt_secret  = process.env.JWT_SECRET
const transporter = require("../config/nodemailer");
const path = require("path");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

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

  async confirm(req, res) {
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

  async login(req, res) {
    try {
      const user = await User.findOne({
        email: req.body.email,
      });
      if (!user.confirmed) {
        return res.send({ message: "Confirme su email primero" });
      }
      const token = jwt.sign({ _id: user._id }, jwt_secret);
      if (user.tokens.length > 4) user.tokens.shift();
      user.tokens.push(token);
      await user.save();
      res.send({ message: "Bienvenid@ " + user.username, token, user });
    } catch (error) {
      console.error(error);
    }
  },

  async getUser(req, res) {
    try {
      const user = await User.findById(req.user._id).populate("postIds")
      res.send(user);
    } catch (error) {
      console.error(error);
    }
  },
  async deleteUser(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.user._id);

 

     await Comment.deleteMany({userId:req.user._id})
      await Post.deleteMany({postIds:req.user.postIds})
     
      // user.postIds.forEach(postId =>{
      //   Post.findById(postId)
      //   Post.remove({"_id":{
      //     $in: user.posts
      //   }})

      // })
      res.send({user, message: "Usuario borrado con exito"});
    } catch (error) {
      console.error(error);
      res.status(500).send({message: "Error al borrar usuario"});
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
        message: "Hubo un problema al intentar conectar al usuario",
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
          res.status(500).send({message: "Hay un problema con el controlador" });
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
          res.status(400).send({message: "No puedes quitar un follow sin darlo primero!"})
        }
        } catch (error) {
          res.status(500).send({message: "Hay un problema con el controlador" });
        }
      },
};

module.exports = UserController;
