const { required } = require("@hapi/joi/lib/base");
const { Post, postFields } = require("../models/post");
const {
  paginationParams,
  sortParams,
  sortParamToString,
  filterOption,
} = require("../utils");
require("express-async-errors");
// const uploadTocloudinary = required("../utils/uploadToCloudinary.js");

exports.all = async (req, res, next) => {
  const { limit, page, skip } = paginationParams(req.query);

  const { sortBy, direction } = sortParams(req.query, postFields);

  const docs = Post.find(filterOption(req.query))
    .sort(sortParamToString(sortBy, direction))
    .skip(skip)
    .limit(limit);
  const allData = Post.countDocuments();
  const response = await Promise.all([docs.exec(), allData.exec()]);
  const [data, total] = response;
  const pages = Math.ceil(total / limit);
  res.json({ data, meta: { limit, skip, total, page, pages } });
};

exports.create = async (req, res, next) => {
  const { body = {} } = req;
  const post = new Post(body);
  const data = await post.save();
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
exports.readPostByUser = async (req, res, next) => {
  const { params = {} } = req;
  const data = await Post.find({ username: params.username });
  res.json({ data });
};
