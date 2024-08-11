// import express
const express = require("express");
const transactionController = require("../controllers/transactionController");
const isAuthenticated = require("../middlewares/isAuth");
// from express we create a router
const transactionRouter = express.Router();
// add
transactionRouter.post(
  "/api/v1/transaction/create",
  isAuthenticated,
  transactionController.create
);
// lists
// here we have to give isAuthenticated middleware because lists are define as per individual user
transactionRouter.get(
  "/api/v1/transaction/lists",
  isAuthenticated,
  transactionController.getFilteredTransaction
);
// update
transactionRouter.put(
  "/api/v1/transaction/update/:id",
  isAuthenticated,
  transactionController.update
);
// delete
transactionRouter.delete(
  "/api/v1/transaction/delete/:id",
  isAuthenticated,
  transactionController.delete
);

module.exports = transactionRouter;
// we have to call the router in main file i.e. app.js
