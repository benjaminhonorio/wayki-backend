const User = require("../models/user");
const Posts = require("../models/posts");

exports.cleanDatabase = async (req, res, next) => {
  await User.deleteMany({});
  await Posts.deleteMany({});

  res.status(204).end();
};
