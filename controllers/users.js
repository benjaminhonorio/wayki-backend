require("dotenv").config();
const usersRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");

const schemaRegister = Joi.object({
  username: Joi.string().min(6).max(30).required(),
  pwd: Joi.string().min(6).max(30).required(),
  email: Joi.string().required().email(),
});

const schemaLogin = Joi.object({
  username: Joi.string().min(6).max(30).required(),
  pwd: Joi.string().min(6).max(30).required(),
});
// const { run } = require("../utils/mail");

const authRoutes = require("../routes/auth");

// usersRouter.use("/", authRoutes);

usersRouter.get("/", function (req, res) {
  User.find({}).then((users) => res.json(users));
});

// function generateAccessToken(user) {
//   const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
//   return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
// }

usersRouter.post("/signup", async function (req, res) {
  const { error, value } = schemaRegister.validate(req.body);
  if (error) {
    return res.json({ error: true, message: error.details[0].message });
  }

  const body = value;
  const emailNotUnique = await User.findOne({ email: body.email });
  const usernameNotUnique = await User.findOne({ username: body.username });

  if (emailNotUnique)
    return res.json({ error: true, message: "Ya existe éste email" });

  if (usernameNotUnique)
    return res.json({
      error: true,
      message: "Ya existe éste nombre de usuario",
    });

  const hashedPassword = await bcrypt.hash(body.pwd, 10);

  const user = new User({
    username: body.username,
    pwd: hashedPassword,
    email: body.email,
  });

  try {
    const savedUser = await user.save();
    // run(body.username, body.email);
    return res.json(savedUser);
  } catch (error) {
    return res.json(error);
  }
});

usersRouter.post("/login", async function (req, res) {
  const { error, value } = schemaLogin.validate(req.body);
  if (error) {
    return res.json({ error: true, message: error.details[0].message });
  }

  const body = value;

  const validUser = await User.findOne({ username: body.username });
  if (!validUser)
    return res.json({ error: true, message: "Nombre de usuario incorrecto" });

  const validPwd = await bcrypt.compare(body.pwd, validUser.pwd);
  if (!validPwd)
    return res.json({ error: true, message: "Contraseña incorrecta" });

  // PayLoad JWT
  const accessToken = jwt.sign(
    {
      username: validUser.username,
      id: validUser._id,
    },
    process.env.ACCESS_TOKEN_SECRET
  );

  try {
    console.log("success");
    return res.json({
      token: accessToken,
      username: body.username,
    });
  } catch (e) {
    console.log(e);
  }
});

module.exports = usersRouter;
