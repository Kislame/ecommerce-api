const winston = require('winston');
module.exports = function (err, req, res, next) {
  winston.log('error', err.message, err);
  //log the exception
  //error
  //warning
  //info
  //verbose
  //debug
  //silly
  res.status(500).send('something failed.');
};
