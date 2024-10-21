const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
  commentor: {
    type: String,
  },
  postId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Posts", // Reference to the Posts model
  },
});

const commentModel = mongoose.model("Comment", commentSchema);
module.exports = commentModel;
