const router = require("express").Router();
const controller = require("../controllers/testing");

router.route("/cleandb").post(controller.cleanDatabase);

module.exports = router;
