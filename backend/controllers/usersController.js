const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

// User Registration
// it is an object
const userController = {
  // register
  register: asyncHandler(
    // wrap this callback in asynchandler
    async (req, res) => {
      // destructuring what user need to register and this is sand in request.boSdy
      // this requrements comes from model-> User
      const { username, email, password } = req.body;
      //   after sending data we have to validate it
      // validate for empty field
      if (!username || !email || !password) {
        throw new Error("Please fill all fields");
      }
      // check for user if already exists
      const userExists = await User.findOne({ email });
      // await in above line shows that we have to stop over further code execution till finishing of above process
      if (userExists) {
        throw new Error("User already exists");
      }
      // Hash the user password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      // create the user and save in the db
      const userCreated = await User.create({
        email,
        username,
        password: hashedPassword,
      });
      // send the response
      // we get response in json so we have to parse it
      res.json({
        username: userCreated.username,
        email: userCreated.email,
        id: userCreated._id,
      });
    }
  ),
  //   Login
  login: asyncHandler(async (req, res) => {
    // taking user data
    const { email, password } = req.body;
    // check for email
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid login credentials");
    }
    // compare the user password
    // we have bcrypt.compare() method to compare hashed pasword
    const isMatch = await bcrypt.compare(password, user.password); // this will return boolean
    if (!isMatch) {
      throw new Error("Invalid login credentials");
    }
    // if match then we generate a jwt token
    const token = jwt.sign({ id: user._id }, "passkey", {
      // here we give expiry of over token
      expiresIn: "30d",
    });
    // send the response
    res.json({
      message: "Login Success",
      token,
      id: user._id,
      email: user.email,
      username: user.username,
    });
  }),
  //   Profile
  profile: asyncHandler(async (req, res) => {
    //find the user
    const user = await User.findById(req.user);
    if (!user) {
      throw new Error("user not found");
    }
    // send the response if user found
    res.json({ username: user.username, email: user.email });
  }),
  // Change / update password
  changeUserPassword: asyncHandler(async (req, res) => {
    // taking new password from request.body
    const { newPassword } = req.body;
    //find the user
    const user = await User.findById(req.user);
    if (!user) {
      throw new Error("user not found");
    }
    // Hash the new password same as we done in registration
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    // Resave the user
    await user.save();

    // send the response if user found
    res.json({ message: "Password changed successfully" });
  }),
  // update user Profile
  updateUserProfile: asyncHandler(async (req, res) => {
    // taking new password from request.body
    const { email, username } = req.body;
    // first argument is id to update and second arg is object what is going to uodate
    const updatedUser = await User.findByIdAndUpdate(
      req.user,
      {
        // username : username  both key and value are the same so we can write as below only one of them
        username,
        email,
      },
      {
        new: true,
      }
    );

    // send the response if user found
    res.json({ message: "User Profile updated successfully", updatedUser });
  }),
};

module.exports = userController;
// now we have to call with the help of router
// each controller have their route.
