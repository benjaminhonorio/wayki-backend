const router = require("express").Router();
const controller = require("../controllers/posts");
const { authToken } = require("../middleware");

router.route("/").get(controller.all).post(authToken, controller.create);

router
  .route("/:id")
  .get(controller.read)
  .put(authToken, controller.update)
  .delete(authToken, controller.delete);

router.route("/:id/update/hidden").put(authToken, controller.updateHidden);
router.route("/:id/update/promoted").put(authToken, controller.updatePromoted);

module.exports = router;
