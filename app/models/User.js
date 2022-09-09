const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { JWT_TOKEN } = process.env;

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    requried: true,
  },

  password: {
    type: String,
    required: true,
  },

  wallet: {
    type: Number,
    default: 0,
  },
});

userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id, name: this.name }, JWT_TOKEN);
};

exports.User = mongoose.model("User", userSchema);
exports.userSchema = userSchema;
