const router = require("express").Router();
const posts = require("./posts");

router.use("/posts", posts);

module.exports = router;
