const mongoose = require("mongoose");

const postFields = {
  titulo: String,
  tipo: String,
  etiquetas: [String],
  caracteristicas: {
    edad: String,
    color: String,
    sexo: String,
    tamaño: String,
  },
  ubicacion: {
    referencia: String,
    lat: Number,
    lng: Number,
  },
  descripcion: String,
  foto_principal: Number,
  fotos: [String],
  hidden: {
    type: Boolean,
    default: false,
  },
  favoritos: [String],
  promocionado: {
    type: Boolean,
    default: false,
  },
};

const postSchema = new mongoose.Schema(postFields, { timestamps: true });

postSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Post", postSchema);

// Schema for arrays don't need default []
// https://mongoosejs.com/docs/schematypes.html#arrays
