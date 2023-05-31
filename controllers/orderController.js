const { Order } = require('../models/Order');
const validate = require('../middleware/validate');
const bcrypt = require('bcrypt');

const { DateTime } = require('luxon');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const { Router } = require('express');
const { User } = require('../models/User');
const { Product } = require('../models/Product');

//user create order
exports.order_create = [
  auth,
  async (req, res, next) => {
    const productIds = req.body.productIds;

    const products = await Product.find({
      _id: { $in: [...productIds] },
    }).select('title price');

    const newOrder = new Order({
      user: req.user._id,
      products: products,
      adress: req.body.adress,
    });
    await newOrder.save();
    res.status(200).json(newOrder);
  },
];

//get user order
exports.order_user_get = [
  auth,
  async (req, res, next) => {
    const orders = await Order.find({ userId: req.user.id });

    res.status(200).json(orders);
  },
];

//update order
exports.order_update = [
  auth,
  admin,
  async (req, res, next) => {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  },
];

//delete order
exports.order_delete = [
  auth,
  admin,
  async (req, res, next) => {
    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json('order deleted');
  },
];

//get orders list
exports.order_list = [
  auth,
  admin,
  async (req, res, next) => {
    const orders = await Order.find();
    res.status(200).json(orders);
  },
];

//GET MONTHLY INCOME

exports.get_income = [
  auth,
  admin,
  async (req, res, next) => {
    const productId = req.query.pid;
    let lastMonth = DateTime.now().minus({ month: 1 }).toISO();
    let previousMonth = DateTime.now().minus({ month: 2 }).toISO();

    const income = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: previousMonth },
          ...(productId && { product: { $elemMatch: { productId } } }),
        },
      },
      {
        $project: {
          month: { $month: '$createdAt' },
          sales: '$amount',
        },
      },
      {
        $group: {
          _id: '$month',
          total: { $sum: '$sales' },
        },
      },
    ]);
    res.status(200).json(income);
  },
];
