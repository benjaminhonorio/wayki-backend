require("dotenv").config();
require("express-async-errors");
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

exports.all = async (req, res, next) => {
  const dataUsers = await User.find({});
  res.json({ dataUsers });
};

// function generateAccessToken(user) {
//   const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
//   return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
// }

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

  try {
    const savedUser = await user.save();
    // run(body.username, body.email);
    return res.json(savedUser);
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
    return res.json({
      token: accessToken,
      username: body.username,
      email: validUser.email,
    });
  } catch (e) {
    console.log(e);
  }
};

exports.updateUser = async (req, res, next) => {
  // Se recupera el id en base al token y el body
  const body = req.body;
  const tokenDecode = jwt.decode(body.token, process.env.ACCESS_TOKEN_SECRET);

  const statusUpdate = await User.findByIdAndUpdate(
    tokenDecode.id,
    { number: body.telephone, bio: body.bio, name: body.name },
    { runValidators: true, new: true }
  );

  try {
    return res.json({
      statusUpdate,
    });
  } catch (e) {
    console.log("error connecting to MongoDB:", e.message);
  }

  // User.findOneAndUpdate(body.username, {
  //   ...body,
  //   number: body.telephone,
  //   bio: body.bio,
  //   name: body.name,
  // }).then((updateUser) => {
  //   console.log("body2");
  //   res.json(updateUser);
  // });
};

exports.readUser = async (req, res, next) => {
  const { params = {} } = req;
  const tokenDecode = jwt.decode(params.token, process.env.ACCESS_TOKEN_SECRET);
  const data = await User.findById(tokenDecode.id);

  try {
    return res.json({
      data,
    });
  } catch (e) {
    console.log("error connecting to MongoDB:", e.message);
  }
};
