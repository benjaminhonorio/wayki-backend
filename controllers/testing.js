const User = require("../models/user");
// const Post = require("../models/post");

exports.cleanDatabase = async (req, res, next) => {
  await User.deleteMany({});
  // await Post.deleteMany({});
  res.status(204).end();
};
