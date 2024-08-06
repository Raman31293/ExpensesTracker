const mongoose = require("mongoose");
// importing mongoose for db

// Schema represents the blueprint of data

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    // what is this
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
// exporting our module
// we are going to use User to create instances
