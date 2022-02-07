const mongoose = require("mongoose");

const userFields = {
  username: {
    type: String,
    required: true,
    min: 6,
    max: 30,
  },
  pwd: {
    type: String,
    required: true,
    min: 6,
    max: 30,
  },
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  number: {
    type: String,
  },
  bio: {
    type: String,
  },
  photo: String,
  posts: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Post",
    },
  ],
};

const userSchema = new mongoose.Schema(userFields, { timestamps: true });

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.pwd;
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
