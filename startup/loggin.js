const winston = require('winston');
require('express-async-errors');

module.exports = function () {
  const files = new winston.transports.File({
    filename: 'logfile.log',
    level: 'info',
  });

  winston.add(files);
  winston.exceptions.handle(
    //    new winston.transport.Console({colorize:true,prettyPrint:true})
    //     ,
    new winston.transports.File({ filename: 'exceptions.log' })
  );
};
