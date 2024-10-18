const express = require("express");
const routes = express.Router(); // Create an instance of the router
const {
  updateUserInfo,
  updatePassword,
  deleteUser,
  forgotPassword,
} = require("../controllers/user"); // Import controller functions
const { loginVerify, logoutVerify } = require("../middlewares/verify");

// Route to update user information
routes.put("/update-user-info", loginVerify, updateUserInfo);

// Route to change the user's password
routes.put("/update-password", loginVerify, updatePassword);

// Route to handle forgotten password
routes.put("/forgot-password", logoutVerify, forgotPassword);

// Route to delete a user
routes.delete("/delete-user", loginVerify, deleteUser);

// Export the router to be used in other parts of the application
module.exports = routes;
