// Check  https://fullstackopen.com/en/part4/user_administration
// Check branches named part4* here -> https://github.com/fullstack-hy2020/part3-notes-backend

const usersRouter = require("express").Router();
const User = require("../models/user");
const { run } = require("../mail/index");

usersRouter.get("/", function (req, res) {
  User.find({}).then((users) => res.json(users));
  // res.json({ hola: 'mundo' });
});

usersRouter.post("/", async function (req, res) {
  const body = req.body;

  if (body.username === undefined) {
    return res.status(400).json({ error: "content missing" });
  }

  const user = new User({
    username: body.username || "No-name",
    pwd: body.pwd,
  });

  const savedUser = await user.save();
  run(body.username);
  res.status(201).json(savedUser);

  // user.save().then((savedUser) => {
  //   res.json(savedUser);
  // });
  // res.json({ hola: 'mundo' });
});

module.exports = usersRouter;
