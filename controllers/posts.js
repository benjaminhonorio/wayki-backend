const { Post, postFields } = require("../models/post");
const User = require("../models/user");
const {
  paginationParams,
  sortParams,
  sortParamToString,
  filterOption,
} = require("../utils");
require("express-async-errors");

exports.all = async (req, res, next) => {
  // TODO: refactor
  const { limit, page, skip } = paginationParams(req.query);
  const { sortBy, direction } = sortParams(req.query, postFields);
  const { neLat, neLng, swLat, swLng } = req.query;
  if ([neLat, neLng, swLat, swLng].every((el) => el !== undefined)) {
    const bounds = {
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [neLng, swLat],
            [swLng, swLat],
            [swLng, neLat],
            [neLng, neLat],
            [neLng, swLat],
          ],
        ],
      },
    };
    const docs = Post.find({
      ...filterOption(req.query),
      location: { $geoWithin: { $geometry: bounds.geometry } },
    })
      .sort(sortParamToString(sortBy, direction))
      .skip(skip)
      .limit(limit)
      .populate("user", { username: 1, email: 1, number: 1 });
    const allData = Post.countDocuments();
    const response = await Promise.all([docs.exec(), allData.exec()]);
    const [data, total] = response;
    const pages = Math.ceil(total / limit);
    res.json({ data, meta: { limit, skip, total, page, pages } });
  } else {
    const docs = Post.find(filterOption(req.query))
      .sort(sortParamToString(sortBy, direction))
      .skip(skip)
      .limit(limit)
      .populate("user", { username: 1, email: 1, number: 1 });
    const allData = Post.countDocuments();
    const response = await Promise.all([docs.exec(), allData.exec()]);
    const [data, total] = response;
    const pages = Math.ceil(total / limit);
    res.json({ data, meta: { limit, skip, total, page, pages } });
  }
};

exports.create = async (req, res, next) => {
  const { body = {}, decodedUser = {} } = req;
  const user = await User.findById(decodedUser.id);
  const post = new Post({ ...body, user: user._id });
  const data = await post.save();
  user.posts = user.posts.concat(data.id);
  await user.save();
  res.status(201).json({ data });
};

exports.read = async (req, res, next) => {
  const { params = {} } = req;
  const data = await Post.findById(params.id);
  res.json({ data });
};

exports.delete = async (req, res, next) => {
  const { params = {} } = req;
  const data = await Post.findByIdAndRemove(params.id);
  res.json({ data });
};

exports.update = async (req, res, next) => {
  const { params = {}, body = {} } = req;
  const post = body;
  // Handle forbidden updates (only "admins" could do this)
  if ("hidden" in post) delete post.hidden;
  if ("promoted" in post) delete post.promoted;
  const data = await Post.findByIdAndUpdate(params.id, post, {
    runValidators: true,
    new: true,
  });
  res.json({ data });
};

// TODO:
//  only admin can hide or unhide
exports.updateHidden = async (req, res, next) => {
  const { params = {}, body = {} } = req;
  const data = await Post.findByIdAndUpdate(
    params.id,
    { hidden: body.hidden },
    { runValidators: true, new: true }
  );
  res.json({ data });
};

// TODO:
// a post can be promoted only after paying a small fee
exports.updatePromoted = async (req, res, next) => {
  const { params = {}, body = {} } = req;
  const data = await Post.findByIdAndUpdate(
    params.id,
    { promoted: body.promoted },
    { runValidators: true, new: true }
  );
  res.json({ data });
};
