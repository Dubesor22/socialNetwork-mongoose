const User = require("../models/User");

const UserController = {
  async create(req, res) {
    try {
      const user = await User.create(req.body);
      res.status(201).send(user);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "Ha habido un problema al crear el usuario" });
    }
  },
};

module.exports = UserController;
