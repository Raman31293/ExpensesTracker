// import express
const express = require("express");
const categoryController = require("../controllers/categoryController");
const isAuthenticated = require("../middlewares/isAuth");
// from express we create a router
const categoryRouter = express.Router();
// add
categoryRouter.post(
  "/api/v1/categories/create",
  isAuthenticated,
  categoryController.create
);
// lists
// here we have to give isAuthenticated middleware because lists are define as per individual user
categoryRouter.get(
  "/api/v1/categories/list",
  isAuthenticated,
  categoryController.lists
);
// update
categoryRouter.put(
  "/api/v1/categories/update/:id",
  isAuthenticated,
  categoryController.update
);
// delete
categoryRouter.delete(
  "/api/v1/categories/delete/:id",
  isAuthenticated,
  categoryController.delete
);

module.exports = categoryRouter;
// we have to call the router in main file i.e. app.js
