const mongoose = require("mongoose");

const postFields = {
  title: {
    type: String,
    required: [true, "Por favor indica el titulo"],
    trim: true,
    maxLength: 100,
  },
  type: {
    type: String,
    required: [true, "Por favor indica el tipo de mascota"],
    trim: true,
    maxLength: 25,
  },
  description: {
    type: String,
    required: [true, "Por favor indica la descripción"],
    trim: true,
  },
  mainPhoto: {
    type: Number,
    default: 0,
  },
  characteristics: {
    name: {
      type: String,
      trim: true,
      maxLength: 25,
      default: "",
    },
    age: {
      type: String,
      required: [true, "Por favor indica la edad de la mascota"],
    },
    color: {
      type: String,
      required: [true, "Por favor indica el color de la mascota"],
      trim: true,
      maxLength: 25,
    },
    sex: {
      type: String,
      required: [true, "Por favor indica el sexo de la mascota"],
      maxLength: 1,
      enum: ["M", "H"],
    },
    size: {
      type: String,
      required: [true, "Por favor indica el tamaño de la mascota"],
      maxLength: 2,
      enum: ["XS", "S", "M", "L", "XL"],
    },
  },
  location: {
    address: {
      type: String,
      default: "",
    },
    reference: {
      type: String,
      required: [true, "Por favor indica una referencia de la ubicación"],
      trim: true,
      maxLength: 255,
    },
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [
        { type: Number, required: true, min: -180, max: 180 },
        { type: Number, required: true, min: -90, max: 90 },
      ],
      index: "2dsphere",
      validate: {
        validator: function (arr) {
          return arr.length === 2;
        },
        message: "Debes indicar solo dos coordenadas",
      },
      required: true,
    },
  },
  tags: [
    {
      type: String,
      trim: true,
      maxLength: 50,
    },
  ],
  photos: [String],
  favorites: [String],
  hidden: {
    type: Boolean,
    default: false,
  },
  promoted: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Por favor indica el usuario"],
  },
};

const postSchema = new mongoose.Schema(postFields, { timestamps: true });

postSchema.post("save", function (doc, next) {
  doc.populate("user", { username: 1, email: 1, number: 1 }).then(function () {
    next();
  });
});

postSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = { Post, postFields };
