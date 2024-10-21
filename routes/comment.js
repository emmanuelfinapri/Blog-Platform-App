const express = require("express");
const {
  makeComment,
  editComment,
  deleteComment,
  viewSingleComment,
  viewAllComments,
  deleteAllComments,
} = require("../controllers/comment");
const { loginVerify, superAdminVerify } = require("../middlewares/verify");
const routes = express.Router();

// Route to create a new comment
routes.post("/make-comment", loginVerify, makeComment);
// Route to edit comment on the Blog App
routes.put("/edit-comment", loginVerify, editComment);
// Route to delete comment on the Blog App
routes.delete("/delete-comment", loginVerify, deleteComment);
// Route to view single comment by ID
routes.get("/view-single-comment", viewSingleComment);
// Route to view all comments by ID
routes.get("/view-all-comments", viewAllComments);
// Route to delete all comments in this App
routes.delete(
  "/delete-all-comments",
  loginVerify,
  superAdminVerify,
  deleteAllComments
);

module.exports = routes;
