const usersRouter = require("express").Router();
const User = require("../models/user");
// const { run } = require("../utils/mail");

usersRouter.get("/", function (req, res) {
  User.find({}).then((users) => res.json(users));
});

usersRouter.post("/", async function (req, res) {
  const body = req.body;

  if (body.username === undefined) {
    return res.status(400).json({ error: "content missing" });
  }

  const user = new User({
    username: body.username,
    password: body.password,
  });

  const savedUser = await user.save();
  // run(body.username);
  res.status(201).json(savedUser);
});

module.exports = usersRouter;
