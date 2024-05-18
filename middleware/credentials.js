const allowedOrigins = require('../origins/allowedOrigins');

const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', origin); // Set the origin for allowed requests
  }
  next();
};

module.exports = credentials;
