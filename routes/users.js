const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const { authentication, isAdmin } = require("../middlewares/authentication");

const upload = require("../middlewares/multer");

router.post("/", UserController.create);
router.put(
  "/",
  authentication,
  upload.single("avatar"),
  UserController.updateUser
  );
  router.get("/confirm/:emailToken", UserController.confirm);
  router.post("/login", UserController.login);
  router.put("/update", authentication, upload.single("avatar"), UserController.updateUser);
  router.get("/",authentication, UserController.getUser);
  router.put("/logout", authentication, UserController.logout);
  router.put("/follow/:_id", authentication, UserController.follow);
  router.put("/unfollow/:_id", authentication, UserController.removeFollow);
  router.delete("/", authentication, UserController.deleteUser);

  router.delete(
      "/clean-all",
      authentication,
      isAdmin,
      UserController.deleteAllUsers
    );
module.exports = router;
