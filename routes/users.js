const router = require("express").Router();
const controller = require("../controllers/users");
const { authToken } = require("../middleware");

router.route("/").get(authToken, controller.all);

router.route("/me").get(authToken, controller.me);

router.route("/emailrecovery").post(controller.emailRecovery);
router.route("/passwordreset").post(controller.resetPassword);

router.route("/signup").post(controller.createUser);
router.route("/login").post(controller.loginUser);

router.route("/profile").put(authToken, controller.updateUser);

router.route("/myposts/:id").get(authToken, controller.myPosts);

module.exports = router;
