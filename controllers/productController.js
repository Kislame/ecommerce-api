const { validateProduct, Product } = require('../models/Product');

const validate = require('../middleware/validate');
const bcrypt = require('bcrypt');

const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const { DateTime } = require('luxon');

//get product details
exports.product_get = [
  auth,
  async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  },
];

//get product list
exports.product_list = [
  auth,
  async (req, res, next) => {
    const queryByNew = req.query.new;
    const queryByCategory = req.query.category;
    let products;
    if (queryByNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(5);
    } else if (queryByCategory) {
      products = await Product.find({
        categories: { $in: [queryByCategory] },
      });
    } else {
      products = await Product.find().limit(9);
    }

    res.status(200).json(products);
  },
];

//create new product
exports.product_create_post = [
  auth,
  admin,
  validate(validateProduct),
  async (req, res, next) => {
    try {
      const product = new Product(req.body);
      await product.save();

      res.status(200).json(product);
    } catch (err) {
      res.status(500).json({ error: 'Error saving product' });
    }
  },
];

//update a product
exports.product_update_put = [
  async (req, res, next) => {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedProduct);
  },
];

//delete a product
exports.product_delete = [
  auth,
  admin,
  async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    res.status(200).send(product._id);
  },
];
