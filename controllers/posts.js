const Post = require("../models/post");
require("express-async-errors"); // no need to use try-catch in every async function with express

exports.getAllPosts = async (req, res, next) => {
  const posts = await Post.find({});
  res.json(posts);
};
exports.createPost = async (req, res, next) => {
  const { body = {} } = req;
  const post = new Post({
    titulo: body.titulo,
    tipo: body.tipo,
    etiquetas: [...body.etiquetas],
    caracteristicas: {
      ...body.caracteristicas,
    },
    ubicacion: {
      ...body.ubicacion,
    },
    descripcion: body.descripcion,
    foto_principal: body.foto_principal,
    fotos: [...body.fotos],
  });
  const savedPost = await post.save();
  res.status(201).json(savedPost);
};

exports.getPost = async (req, res, next) => {
  const { params = {} } = req;
  const { id = "" } = params;
  const post = await Post.findById(id);
  if (post) {
    res.json(post);
  } else {
    res.status(404).end();
  }
};
exports.deletePost = async (req, res, next) => {
  await Post.findByIdAndRemove(req.params.id);
  res.status(204).end();
};
exports.updatePost = async (req, res, next) => {
  const { body = {}, params = {}, query = {} } = req;
  const post = {
    titulo: body.titulo,
    tipo: body.tipo,
    etiquetas: [...body.etiquetas],
    caracteristicas: {
      ...body.caracteristicas,
    },
    ubicacion: {
      ...body.ubicacion,
    },
    descripcion: body.descripcion,
    foto_principal: body.foto_principal,
    fotos: [...body.fotos],
    // to think about
    // hidden: body.hidden,
    // favoritos: [...body.favoritos],
  };
  const updatedPost = await Post.findByIdAndUpdate(params.id, post, {
    new: true,
  });
  res.json({ data: body, query, params });
};
