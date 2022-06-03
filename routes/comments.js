const express = require("express");
const router = express.Router();
const CommentController = require("../controllers/CommentController");
const { authentication, isAdmin } = require("../middlewares/authentication");

router.post("/:_id", authentication, CommentController.create);
router.put("/update/:_id", authentication, isAdmin, CommentController.update);
router.get("/", CommentController.getAll);
router.delete("/:_id", authentication, CommentController.delete)

module.exports = router;
