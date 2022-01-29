const router = require("express").Router();
const controller = require("../controllers/users");

router.route("/").get(controller.all);

router.route("/signup").post(controller.createUser);

router.route("/login").post(controller.loginUser);

module.exports = router;
