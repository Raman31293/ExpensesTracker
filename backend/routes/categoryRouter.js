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
categoryRouter.post("/api/v1/categories/list", categoryController.list);

module.exports = categoryRouter;
// we have to call the router in main file i.e. app.js
