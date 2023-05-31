const validate = require('../middleware/validate');
const bcrypt = require('bcrypt');

const { DateTime } = require('luxon');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Cart } = require('../models/Cart');

//get user cart
exports.cart_get = [
  auth,
  async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user._id });
    res.status(200).send(cart);
  },
];

//create cart
exports.cart_create = [
  auth,
  async (req, res, next) => {
    const newCart = new Cart({
      userId: req.user._id,
      products: [req.body],
    });

    const savedCart = newCart.save();
    res.status(200).send(savedCart);
  },
];

//update cart
exports.cart_update = [
  auth,
  async (req, res, next) => {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).send(updatedCart);
  },
];

//////// admin routes

//get cart list
exports.cart_list = [
  auth,
  admin,
  async (req, res, next) => {
    const carts = await Cart.find();
    res.status(200).send(carts);
  },
];

//cart delete
exports.cart_delete = [
  auth,
  admin,
  async (req, res, next) => {
    await Cart.findByIdAndDelete(req.params.id);

    res.status(200).json('cart deleted');
  },
];
