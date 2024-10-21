const express = require("express");
const {
  makePost,
  getAllPost,
  getSinglePost,
  updatePost,
  deletePost,
  likePost,
  deleteAllPosts,
} = require("../controllers/post");
const { loginVerify, superAdminVerify } = require("../middlewares/verify");
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
// Route to delete all posts
routes.delete(
  "/delete-all-posts",
  loginVerify,
  superAdminVerify,
  deleteAllPosts
);
// Route to like a single post by ID
routes.post("/like-post-by-id", loginVerify, likePost);

module.exports = routes;
