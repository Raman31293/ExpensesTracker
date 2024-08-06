// we need jwt for that to verify user
const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
  //  get the token from header
  const headerObj = req.headers;
  const token = headerObj?.authorization?.split(" ")[1];

  //   verify the token
  const verifyToken = jwt.verify(token, "passkey", (err, decoded) => {
    if (err) {
      return false;
    } else {
      return decoded;
    }
  });
  if (verifyToken) {
    //save the user req obj
    req.user = verifyToken.id;
    next(); //this will call next middleware if any
  } else {
    const err = new Error("Token expired, login again");
    next(err);
  }
};

module.exports = isAuthenticated;

// we use this on any route which one we protect
