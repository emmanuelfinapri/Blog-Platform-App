const mongoose = require("mongoose");
const { commentSchema } = require("../models/comment"); // You may not need this import here

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    previewPics: {
      type: String,
      required: true,
    },
    detailPics: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Technology", "Health", "Lifestyle", "Education", "Business"],
    },
    postCreator: {
      type: String,
    },
    likes: {
      type: [String],
    },
    comments: [
      {
        commentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Comment", // Reference the Comment model
        },
        commentText: {
          type: String,
        },
        commentor: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

const postModel = mongoose.model("Posts", postSchema);
module.exports = postModel;
