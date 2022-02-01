require("dotenv").config();
require("express-async-errors");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const { update } = require("./posts");

const schemaRegister = Joi.object({
  username: Joi.string().min(6).max(30).required(),
  pwd: Joi.string().min(6).max(30).required(),
  validPwd: Joi.string().min(6).max(30).required(),
  email: Joi.string().required().email(),
});

const schemaLogin = Joi.object({
  username: Joi.string().min(6).max(30).required(),
  pwd: Joi.string().min(6).max(30).required(),
});
// const { run } = require("../utils/mail");

exports.all = async (req, res, next) => {
  const dataUsers = await User.find({});
  res.json({ dataUsers });
};

exports.createUser = async (req, res, next) => {
  const { error, value } = schemaRegister.validate(req.body);
  if (error) {
    return res.json({ error: true, message: error.details[0].message });
  }

  const body = value;

  if (body.pwd !== body.validPwd)
    return res.json({ error: true, message: "Las contraseñas no coinciden" });

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
    console.log("success");
  } catch (e) {
    console.log(e);
  }

  try {
    const savedUser = await user.save();
    const accessToken = jwt.sign(
      {
        username: user.username,
        id: user._id,
      },
      process.env.ACCESS_TOKEN_SECRET
    );

    // run(body.username, body.email);
    return res.json({
      savedUser,
      token: accessToken,
      username: body.username,
    });
  } catch (error) {
    return res.json(error);
  }
};

exports.loginUser = async (req, res, next) => {
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
};

exports.updateUser = async (req, res, next) => {
  const body = req.body;

  User.findOneAndUpdate(body.username, {
    ...body,
    number: body.telephone,
    bio: body.bio,
    name: body.name,
  }).then((updatedUser) => {
    res.json(updatedUser);
  });
};
