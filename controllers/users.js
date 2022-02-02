require("dotenv").config();
require("express-async-errors");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const { update } = require("./posts");
const { welcomeEmail, changePassword } = require("../utils/mail");

const schemaRegister = Joi.object({
  username: Joi.string().min(6).max(30).required(),
  pwd: Joi.string().min(6).max(30).required(),
  email: Joi.string().required().email(),
});

const schemaLogin = Joi.object({
  username: Joi.string().min(6).max(30).required(),
  pwd: Joi.string().min(6).max(30).required(),
});

const schemaEmailRecovery = Joi.object({
  email: Joi.string().required().email(),
});

const schemaResetPassword = Joi.object({
  newPwd: Joi.string().min(6).max(30).required(),
  id: Joi.string(),
});

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
  const savedUser = await user.save();
  welcomeEmail(body.username, body.email);
  // delete savedUser.pwd;
  const accessToken = jwt.sign(
    {
      username: user.username,
      id: user._id,
    },
    process.env.ACCESS_TOKEN_SECRET
  );

  return res.json({
    token: accessToken,
    username: savedUser.username,
    id: savedUser._id,
  });
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
      username: validUser.username,
      id: validUser._id,
    });
  } catch (e) {
    console.log(e);
  }
};

exports.emailRecovery = async (req, res, next) => {
  const { error, value } = schemaEmailRecovery.validate(req.body);
  if (error) {
    return res.json({ error: true, message: error.details[0].message });
  }

  const body = value;
  console.log(value);
  const validUser = await User.findOne({ email: body.email });
  console.log(validUser);

  if (!validUser)
    return res.json({
      error: true,
      message: "Éste email no está asociado a ningún usuario",
    });

  try {
    changePassword(validUser.username, validUser.email, validUser._id);
    return res.json({
      error: false,
      id: validUser._id,
    });
  } catch (e) {
    console.log(e);
  }
};

exports.resetPassword = async (req, res, next) => {
  const { error, value } = schemaResetPassword.validate(req.body);
  if (error) {
    return res.json({ error: true, message: error.details[0].message });
  }

  const body = value;

  const hashedPassword = await bcrypt.hash(body.newPwd, 10);

  try {
    User.findByIdAndUpdate(
      body.id,
      {
        pwd: hashedPassword,
      },
      { runValidators: true, new: true }
    ).then((updatedUser) => {
      res.json(updatedUser);
    });
  } catch (error) {
    return res.json(error);
  }
};
