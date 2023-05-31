const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 100,
      unique: true,
      match: /^[A-z][A-z0-9-_]{3,23}$/,
    },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 1024,
    },
    refreshToken: { type: String },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = function () {
  const accessToken = jwt.sign(
    { id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_ACCESS_KEY,
    { expiresIn: '15m' }
  );
  return accessToken;
};

userSchema.methods.generateRefrechToken = function () {
  const refreshToken = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_REFRESH_KEY,
    { expiresIn: '1d' }
  );
  return refreshToken;
};

function validateUser(data) {
  const schema = Joi.object({
    username: Joi.string()
      .required()
      .pattern(/^[A-z][A-z0-9-_]{3,23}$/)
      .min(3)
      .max(100)
      .trim(),
    email: Joi.string().email().required().max(255),
    password: Joi.string()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/)
      .required()
      .max(255),
  });
  return schema.validate(data);
}

exports.User = mongoose.model('User', userSchema);
exports.validateUser = validateUser;
