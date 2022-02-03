const router = require("express").Router();
const controller = require("../controllers/users");

router.route("/").get(controller.all);

router.route("/signup").post(controller.createUser);

router.route("/login").post(controller.loginUser);

router.route("/profile/:token").get(controller.readUser);

router.route("/profile").put(controller.updateUser);

module.exports = router;
