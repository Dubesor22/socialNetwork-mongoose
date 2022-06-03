const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const { authentication, isAdmin } = require("../middlewares/authentication");

const upload = require("../middlewares/multer");

router.post("/", authentication, UserController.create);
router.put(
  "/",
  authentication,
  upload.single("avatar"),
  UserController.updateUser
);
router.get("/confirm/:emailToken", UserController.confirm);
router.post("/login", UserController.login);
router.get("/", authentication, UserController.getUser);
router.delete(
  "/clean-all",
  authentication,
  isAdmin,
  UserController.deleteAllUsers
);
router.put("/logout", authentication, UserController.logout);

module.exports = router;
