const router = require("express").Router();
const controller = require("../controllers/posts");

router
  .route("/")
  .get(controller.getAllPosts)
  .post(controller.createPost);

router
  .route("/:id")
  .get(controller.getPost)
  .put(controller.updatePost)
  .delete(controller.deletePost);

module.exports = router;
