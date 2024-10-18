const mongoose = require("mongoose");

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
  },
  { timestamps: true }
);

const postModel = mongoose.model("Posts", postSchema);
module.exports = postModel;
