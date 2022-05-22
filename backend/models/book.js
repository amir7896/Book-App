const mongoose = require("mongoose");
const User = require("./User");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  image: [
    {
      url: String,
      filename: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  price: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Book", bookSchema);
