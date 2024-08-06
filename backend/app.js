// importing express
const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRouter");
const errorHandler = require("./middlewares/errorHandlerMiddleware");
const categoryRouter = require("./routes/categoryRouter");
const app = express();

// connect to mongodb
mongoose
  .connect(
    "mongodb+srv://raman31293:qwertyuiop@raman.32vvs85.mongodb.net/Expense-Tracker"
  )
  //we got a promise we have to resolve it
  .then(() => console.log("DB Connected"))
  .catch((e) => console.log(e));

// middlewares
app.use(express.json()); // Pass incoming json data as we have to pass only json data to server

// Routes
app.use("/", userRouter);
app.use("/", categoryRouter);
// use error middleware below all routes
app.use(errorHandler);

// start the server
// giving PORT number
const PORT = process.env.PORT || 8000;
//  ${PORT} this will work with the back tick `
// first argument of app.listen is PORT
app.listen(PORT, () => console.log(`Server is running on this ${PORT}`));
