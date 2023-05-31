const express = require('express');
const { request } = require('https');
const home = require('../routes/home');
const user = require('../routes/user');
const auth = require('../routes/auth');
const product = require('../routes/product');
const order = require('../routes/order');
const cart = require('../routes/cart');
const checkout = require('../routes/checkout');
const error = require('../middleware/error');
const refresh = require('../routes/refresh');
const logout = require('../routes/logout');

module.exports = function (app) {
  app.use('/', home);
  app.use('/api/auth', auth);
  app.use('/api/refresh', refresh);
  app.use('/api/logout', logout);
  app.use('/api/user', user);
  app.use('/api/product', product);
  app.use('/api/cart', cart);
  app.use('/api/order', order);
  app.use('/api/checkout', checkout);
  app.use(error);
};
