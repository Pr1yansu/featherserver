const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter name"],
  },
  email: {
    type: String,
    required: [true, "Please enter email"],
    unique: true,
    validate: [validator.isEmail, "Provide a valid email"],
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId; // Required only for normal login users
    },
  },
  googleId: {
    type: String,
    unique: true,
  },
  avatar: {
    publicId: {
      type: String,
      required: function () {
        return !this.googleId; // Required only for normal login users
      },
    },
    url: {
      type: String,
      required: function () {
        return !this.googleId; // Required only for normal login users
      },
    },
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
