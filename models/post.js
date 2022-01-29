const mongoose = require("mongoose");

const postFields = {
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 255,
  },
  type: {
    type: String,
    required: true,
    trim: true,
    maxLength: 25,
  },
  description: {
    type: String,
    required: true,
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
      required: true,
    },
    color: {
      type: String,
      required: true,
      trim: true,
      maxLength: 25,
    },
    sex: {
      type: String,
      required: true,
      maxLength: 1,
      enum: ["M", "H"],
    },
    size: {
      type: String,
      required: true,
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
      required: true,
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
        message: "You must provide only two coordinates.",
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
