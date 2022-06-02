const express = require("express");
const router = express.Router();
const CommentController = require("../controllers/CommentController");
const { authentication, isAdmin } = require("../middlewares/authentication");

router.post("/:_id", authentication, CommentController.create);
// router.put("/update/:_id", authentication, CommentController.update);

module.exports = router;
