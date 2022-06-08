const express = require("express");
const router = express.Router();
const CommentController = require("../controllers/CommentController");
const { authentication, isAdmin, isAuthor } = require("../middlewares/authentication");

router.post("/:_id", authentication, CommentController.create);
router.put("/:_id", authentication, isAdmin, CommentController.update);
router.get("/", CommentController.getAll);
router.delete("/:_id", authentication, isAuthor, CommentController.delete);
router.delete("/admin/:_id", authentication, isAdmin, CommentController.deleteForAdmin);
router.put("/like", authentication, CommentController.like);
router.put("/dislike", authentication, CommentController.likeDown);

module.exports = router;
