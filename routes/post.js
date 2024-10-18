const express = require("express");
const {
  makePost,
  getAllPost,
  getSinglePost,
  updatePost,
  deletePost,
  likePost,
} = require("../controllers/post");
const { loginVerify, logoutVerify } = require("../middlewares/verify");
const routes = express.Router();

// Route to create a new post
routes.post("/create-post", loginVerify, makePost);
// Route to get all posts on the Blog App
routes.get("/get-all-posts", getAllPost);
// Route to get single post by ID
routes.get("/get-post-by-id", getSinglePost);
// Route to update a single post by ID
routes.put("/update-post-by-id", loginVerify, updatePost);
// Route to delete a single post by ID
routes.delete("/delete-post-by-id", loginVerify, deletePost);
// Route to like a single post by ID
routes.post("/like-post-by-id", loginVerify, likePost);

module.exports = routes;
