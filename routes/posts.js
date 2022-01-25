const router = require("express").Router();
const controller = require("../controllers/posts");

router.route("/").get(controller.all).post(controller.create);

router.param("id", controller.id);

router
  .route("/:id")
  .get(controller.read)
  .put(controller.update)
  .delete(controller.delete);

module.exports = router;
