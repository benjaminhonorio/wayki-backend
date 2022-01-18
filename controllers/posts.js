const postsRouter = require("express").Router();
const { response } = require("express");
const Post = require("../models/post");

postsRouter.get("/", async (req, res, next) => {
  const posts = await Post.find({});
  res.json(posts);
});

postsRouter.get("/:id", async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (post) {
    res.json(post);
  } else {
    res.status(404).end();
  }
});

postsRouter.post("/", async (req, res, next) => {
  const body = req.body;
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
});

postsRouter.delete("/:id", async (req, res, next) => {
  await Post.findByIdAndRemove(req.params.id);
  res.status(204).end();
});

postsRouter.put("/:id", async (req, res, next) => {
  const body = req.body;
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
    // hidden: body.hidden,
    // favoritos: [...body.favoritos],
  };
  const updatedPost = await Post.findByIdAndUpdate(req.params.id, post, {
    new: true,
  });
  res.json(updatedPost);
});

module.exports = postsRouter;
