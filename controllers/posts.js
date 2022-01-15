const postsRouter = require("express").Router();

postsRouter.get("/", function (req, res) {
  res.json({ hola: "mundo" });
});

module.exports = postsRouter;
