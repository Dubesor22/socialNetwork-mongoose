const express = require("express");
const router = express.Router();
const PostController = require("../controllers/PostController");
const { authentication, isAdmin } = require("../middlewares/authentication");

router.post("/", authentication, PostController.create);
router.get("/", PostController.getAll);
router.get("/id/:_id", PostController.getById);
router.get("/name/:username", PostController.getPostsByUserName);
router.delete("/:_id", PostController.delete);
router.delete("/delete/:Username", PostController.delete);
router.put("/id/:_id", PostController.update);

module.exports = router;
