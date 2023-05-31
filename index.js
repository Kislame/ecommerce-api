require('express-async-errors');
const express = require('express');
const cors = require('cors');
const winston = require('winston');
const corsOptions = require('./origins/corsOptions');
const app = express();
const port = process.env.PORT || 3000;
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const morgan = require('morgan');

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//middleware for cookies
app.use(cookieParser());

app.use(morgan('dev'));

require('./startup/prod')(app);
require('./startup/loggin')();
require('./startup/routes')(app);
require('./startup/db')();

app.listen(port, () => {
  console.log('listening on port ' + port);
});
