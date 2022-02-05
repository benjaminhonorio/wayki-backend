require("express-async-errors");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const { welcomeEmail, changePassword } = require("../utils/mail");
const config = require("../config");

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
  const data = await User.find({}).populate("posts");
  res.json({ data });
};

// Get user for profile
exports.me = async (req, res, next) => {
  const { decodedUser = {} } = req;
  const user = await User.findById(decodedUser.id);
  res.json(user);
};

exports.createUser = async (req, res, next) => {
  const { error, value: body } = schemaRegister.validate(req.body);
  if (error) {
    return res.json({ error: true, message: error.details[0].message });
  }

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
  const accessToken = jwt.sign(
    {
      username: user.username,
      id: user._id,
      email: user.email,
    },
    config.ACCESS_TOKEN_SECRET
  );

  return res.json({
    token: accessToken,
    username: savedUser.username,
    email: savedUser.email,
    id: savedUser._id,
  });
};

exports.loginUser = async (req, res, next) => {
  const { error, value: body } = schemaLogin.validate(req.body);
  if (error) {
    return res.json({ error: true, message: error.details[0].message });
  }

  const validUser = await User.findOne({ username: body.username }).populate(
    "posts"
  );
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
      email: validUser.email,
    },
    config.ACCESS_TOKEN_SECRET
  );

  res.json({
    token: accessToken,
    email: validUser.email,
    username: validUser.username,
    id: validUser._id,
    posts: validUser.posts,
  });
};

exports.emailRecovery = async (req, res, next) => {
  const { error, value: body } = schemaEmailRecovery.validate(req.body);
  if (error) {
    return res.json({ error: true, message: error.details[0].message });
  }
  const validUser = await User.findOne({ email: body.email });

  if (!validUser)
    return res.json({
      error: true,
      message: "Éste email no está asociado a ningún usuario",
    });

  changePassword(validUser.username, validUser.email, validUser._id);
  res.json({
    error: false,
    id: validUser._id,
  });
};

exports.resetPassword = async (req, res, next) => {
  const { error, value: body } = schemaResetPassword.validate(req.body);
  if (error) {
    return res.json({ error: true, message: error.details[0].message });
  }
  const hashedPassword = bcrypt.hash(body.newPwd, 10);

  const updatedUser = await User.findByIdAndUpdate(
    body.id,
    { pwd: hashedPassword },
    { runValidators: true, new: true }
  );
  res.json(updatedUser);
};

exports.updateUser = async (req, res, next) => {
  const { decodedUser = {} } = req;
  const updatedUser = await User.findByIdAndUpdate(decodedUser.id, req.body, {
    runValidators: true,
    new: true,
  });
  res.json(updatedUser);
};
