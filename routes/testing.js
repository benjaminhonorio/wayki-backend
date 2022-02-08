const router = require("express").Router();
const controller = require("../controllers/testing");

router.route("/cleanusers").delete(controller.cleanUsers);
router.route("/cleanposts").delete(controller.cleanPosts);

module.exports = router;
