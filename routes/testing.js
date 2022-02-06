const router = require("express").Router();
const controller = require("../controllers/testing");

router.route("/cleandb").get(controller.cleanDatabase);

module.exports = router;
