const mongoose = require("mongoose");
// const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  pwd: {
    type: String,
    required: true,
  },
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
  },
});

// userSchema.plugin(uniqueValidator);

const User = mongoose.model("User", userSchema);

module.exports = User;
