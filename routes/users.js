const router = require("express").Router();
const controller = require("../controllers/users");
const { authToken } = require("../middleware");

router.route("/").get(controller.all);

router.route("/emailrecovery").post(controller.emailRecovery);

router.route("/passwordreset").post(controller.resetPassword);

router.route("/signup").post(controller.createUser);

router.route("/login").post(controller.loginUser);

router.route("/profile/:token").get(controller.readUser);

router.route("/profile").put(controller.updateUser);

module.exports = router;
