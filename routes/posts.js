const router = require("express").Router();
const controller = require("../controllers/posts");

router.route("/").get(controller.all).post(controller.create);

router
  .route("/:id")
  .get(controller.read)
  .put(controller.update)
  .delete(controller.delete);

router.route("/:id/update/hidden").put(controller.updateHidden);
router.route("/:id/update/promoted").put(controller.updatePromoted);
router.route("/myposts/:username").get(controller.readPostByUser);

module.exports = router;
