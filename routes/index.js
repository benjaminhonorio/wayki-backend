const router = require("express").Router();
const posts = require("./posts");
const users = require("./users");
const test = require("./testing");

router.use("/posts", posts);
router.use("/users", users);
router.use("/", test);

module.exports = router;
