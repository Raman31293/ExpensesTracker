const errorHandler = (err, req, res, next) => {
  // Sometimes when we have response error but still on bar we show status code 200 so to handle these condition

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  // next is a function helps to move to another middleware
  res.json({
    message: err.message,
    stack: err.stack, //this will shows the line or file where error occured
  });
};

module.exports = errorHandler;
