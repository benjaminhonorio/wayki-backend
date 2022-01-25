const mongoose = require("mongoose");

const postFields = {
  titulo: { type: String, required: true, trim: true, maxLength: 255 },
  tipo: { type: String, required: true, trim: true, maxLength: 25 },
  descripcion: { type: String, required: true, trim: true, maxLength: 255 },
  foto_principal: { type: Number, default: 0 },
  caracteristicas: {
    edad: { type: String, required: true, trim: true, maxLength: 25 },
    color: { type: String, required: true, trim: true, maxLength: 25 },
    sexo: { type: String, required: true, maxLength: 1 },
    tamaño: { type: String, required: true, maxLength: 2 },
  },
  ubicacion: {
    referencia: { type: String, required: true, trim: true, maxLength: 255 },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  etiquetas: [{ type: String, trim: true, maxLength: 50 }],
  fotos: [String],
  favoritos: [String],
  hidden: { type: Boolean, default: false },
  promocionado: { type: Boolean, default: false },
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
