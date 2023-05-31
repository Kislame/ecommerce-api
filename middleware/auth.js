const jwt = require('jsonwebtoken');
require('dotenv').config();
function auth(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization; //Bearer token
  if (!authHeader?.startsWith('Bearer '))
    return res.status(401).send('acess denied. no token provided');
  try {
    const token = authHeader.split(' ')[1];
    const decodedPayload = jwt.verify(token, process.env.JWT_ACCESS_KEY);
    req.user = decodedPayload;
    next();
  } catch (ex) {
    res.status(403).send('invalid token');
  }
}

module.exports = auth;
