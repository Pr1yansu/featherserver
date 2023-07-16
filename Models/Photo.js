const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please give a title"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please give a description"],
  },
  images: [
    {
      publicId: {
        type: String,
        required: [true, "Please give a publicId"],
      },
      url: {
        type: String,
        required: [true, "Please give a url"],
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
    required: [true, "Please give a createdAt"],
  },
  user: {
    type: String,
    ref: "User",
    required: [true, "Please give a user"],
  },
  category: {
    type: String,
    ref: "Category",
    required: [true, "Please give a category"],
  },
  price: {
    type: Number,
    required: [true, "Please give a price"],
  },
  rating: {
    type: Number,
    default: 0,
  },
  numberOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: String,
        ref: "User",
        required: [true, "Please give a user"],
      },
      comment: {
        type: String,
        required: [true, "Please give a comment"],
      },
      like: {
        type: Number,
        default: 0,
      },
    },
  ],
});

const Photo = mongoose.model("Photo", photoSchema);

module.exports = Photo;
