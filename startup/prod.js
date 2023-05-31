const compression = require('compression');
const helmet = require('helmet');
// Set up rate limiter: maximum of twenty requests per minute
const RateLimit = require('express-rate-limit');
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});

module.exports = function (app) {
  app.use(helmet());
  app.use(compression());
  app.use(limiter);
};
