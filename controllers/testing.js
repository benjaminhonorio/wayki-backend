const User = require("../models/user");
const { Post } = require("../models/post");

exports.cleanUsers = async (req, res, next) => {
  await User.deleteMany({});
  res.status(204).end();
};

exports.cleanPosts = async (req, res, next) => {
  await Post.deleteMany({});
  res.status(204).end();
};
