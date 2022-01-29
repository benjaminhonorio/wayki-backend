const auth = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { run } = require("../utils/mail");
const User = require("../models/user");

auth.post("/signup", async function (req, res) {
  const body = req.body;
  const hashedPassword = await bcrypt.hash(req.body.pwd, 10);

  if (body.username === undefined) {
    return res.status(400).json({ error: "content missing" });
  }

  const user = new User({
    username: body.username,
    pwd: hashedPassword,
    email: body.email,
  });

  try {
    const savedUser = await user.save();
    run(body.username, body.email);
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json(error);
  }
});

auth.post("/login", async function (req, res) {
  const body = req.body;
  const userLogin = await User.findOne({ username: body.username });
  const accessToken = jwt.sign(
    userLogin.username,
    process.env.ACCESS_TOKEN_SECRET
  );
  if (userLogin === null) {
    res.status(400).send("No se puede encontrar al usuario");
  }
  try {
    if (await bcrypt.compare(req.body.pwd, userLogin.pwd)) {
      console.log(accessToken);
      res.json({ accessToken: accessToken });
    } else {
      res.send("No Loggeado");
    }
  } catch {
    res.status(500).send;
  }
});

function authToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null) return res.sendStatus(402);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
