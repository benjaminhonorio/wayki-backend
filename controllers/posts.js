const Post = require("../models/post");
require("express-async-errors"); // no need to use try-catch in every async function with express

exports.id = async (req, res, next) => {
  const { params = {} } = req;
  const { id = "" } = params;
  const data = await Post.findById(id);
  if (!data) {
    const message = `${Post.modelName} not found`;
    next({ message, status: 404 });
  } else {
    req.data = data;
    next();
  }
};

exports.all = async (req, res, next) => {
  const data = await Post.find({});
  res.json({ data });
};

exports.create = async (req, res, next) => {
  const { body = {} } = req;
  const post = new Post({
    titulo: body.titulo,
    tipo: body.tipo,
    etiquetas: [...body.etiquetas],
    caracteristicas: { ...body.caracteristicas },
    ubicacion: { ...body.ubicacion },
    descripcion: body.descripcion,
    foto_principal: Number(body.foto_principal),
    fotos: [...body.fotos],
  });
  const data = await post.save();
  res.status(201).json({ data });
};

exports.read = async (req, res, next) => {
  const { data = {} } = req;
  res.json({ data });
};

exports.delete = async (req, res, next) => {
  const { data: doc = {} } = req;
  const data = await doc.remove();
  res.json({ data });
};

exports.update = async (req, res, next) => {
  const { data: doc = {}, body = {} } = req;
  const { favoritos, promocionado, hidden } = doc; // estas propiedades del doc cuando se crea
  const post = {
    titulo: body.titulo,
    tipo: body.tipo,
    etiquetas: body.etiquetas != undefined ? [...body.etiquetas] : [],
    caracteristicas:
      body.caracteristicas != undefined ? { ...body.caracteristicas } : {},
    ubicacion: body.ubicacion != undefined ? { ...body.ubicacion } : {},
    descripcion: body.descripcion,
    foto_principal: Number(body.foto_principal),
    fotos: body.fotos != undefined ? [...body.fotos] : [],
    favoritos,
    hidden,
    promocionado,
  };
  const data = await Post.findByIdAndUpdate(req.params.id, post, {
    new: true,
  });
  res.json({ data });
};
