const express = require("express");
const router = express.Router();
const PostController = require("../controllers/PostController");
const {
  authentication,
  isAdmin,
  isAuthor,
} = require("../middlewares/authentication");

router.post("/", authentication, PostController.create);
router.get("/", PostController.getAll);
router.get("/id/:_id", PostController.getById);
router.get("/name/:username", PostController.getPostsByUserName);
router.delete("/:_id", authentication, isAuthor, PostController.delete);
router.delete("/delete/:Username", isAdmin, PostController.deleteByUser);
router.put("/id/:_id", isAuthor, PostController.update);
router.put("/like/:_id", authentication, PostController.like);
router.put("/dislike/:_id",authentication, PostController.dislike)
router.delete("/delte_all", isAdmin, PostController.deleteAll);

module.exports = router;
