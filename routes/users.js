const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const { authentication, isAdmin } = require("../middlewares/authentication");

router.post("/", UserController.create);
router.get("/confirm/:emailToken", UserController.confirm);
router.post("/login", UserController.login);
router.get("/list", authentication, UserController.getAllUsers);
router.delete("/clean-all", UserController.deleteAllUsers);
router.put("/logout", authentication, UserController.logout);

module.exports = router;
