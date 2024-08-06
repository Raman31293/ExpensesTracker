// import express
const express = require("express");
const userController = require("../controllers/usersController");
const isAuthenticated = require("../middlewares/isAuth");

// from express we create a router
const userRouter = express.Router();
// user registration route
// router.method('/path', module.register)
userRouter.post("/api/v1/users/register", userController.register);
// login
userRouter.get("/api/v1/users/login", userController.login);
// Profile
userRouter.get(
  "/api/v1/users/profile",
  isAuthenticated,
  userController.profile
);
// change/ update password
userRouter.put(
  "/api/v1/users/changePassword",
  isAuthenticated,
  userController.changeUserPassword
);
// update user profile
userRouter.put(
  "/api/v1/users/updateUserProfile",
  isAuthenticated,
  userController.updateUserProfile
);

module.exports = userRouter;
// we have to call the router in main file i.e. app.js
