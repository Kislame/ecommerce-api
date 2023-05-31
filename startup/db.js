const mongoose = require('mongoose');
const winston = require('winston');
require('dotenv').config();
module.exports = function () {
  mongoose
    .connect(process.env.DB_KEY)
    .then(() => winston.info(`connected succesfully to the db}`))
    .catch((err) => console.log(err));
};
