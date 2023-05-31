const { validateUser, User } = require('../models/User');
const { Cart } = require('../models/Cart');
const validate = require('../middleware/validate');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { DateTime } = require('luxon');

//register a user
exports.user_create_post = [
  validate(validateUser),
  async (req, res, next) => {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(409).send('user already registerd');

    user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    let cart = new Cart({
      user: user._id,
      products: [],
    });
    await cart.save();

    res.status(201).send('account registred');
  },
];

//admin routes

//get user detail
exports.user_detail_get = [
  auth,
  admin,
  async (req, res, next) => {
    const user = await User.findById(req.params.id).select('-password');
    res.status(200).send(user._doc);
  },
];

//update a user
exports.user_update_post = [
  auth,
  admin,
  validate(validateUser),
  async (req, res, next) => {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).send(updateUser);
  },
];

//deleted a user
exports.user_delete = [
  auth,
  admin,
  async (req, res, nex) => {
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user) res.status(404).send('user dosnt exist');
    res.status(200).send('user has been deleted');
  },
];

//get users list:
exports.user_list = [
  auth,
  admin,
  async (req, res, next) => {
    const query = req.query.new;

    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    res.status(200).json(users);
  },
];

//get user stats
exports.user_stats = [
  auth,
  admin,
  async (req, res, next) => {
    let lastYear = DateTime.now().year - 1;
    lastYear = DateTime.local(lastYear);
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: '$createdAt' },
        },
      },
      {
        $group: {
          _id: '$month',
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  },
];
