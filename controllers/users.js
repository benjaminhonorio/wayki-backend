// Check  https://fullstackopen.com/en/part4/user_administration
// Check branches named part4* here -> https://github.com/fullstack-hy2020/part3-notes-backend

const usersRouter = require("express").Router();

usersRouter.get("/", function (req, res) {
  res.json({ hola: "mundo" });
});

module.exports = usersRouter;
