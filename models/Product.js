const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 100,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      maxLength: 1000,
      minLength: 5,
    },
    img: { type: String, required: true },
    color: { type: Array },
    price: { type: Number, required: true },
    size: { type: Array, required: true },
    rating: { type: Number, required: true },
    categories: { type: Array },
    inStock: { type: Boolean, default: true },
    numberInStock: {
      type: Number,
      default: 0,
      min: 1,
      max: 200,
      required: true,
    },
  },
  { timestamps: true }
);

productSchema.virtual('url').get(function () {
  return `/api/product/${this._id}`;
});

function validateProduct(product) {
  const schema = Joi.object({
    title: Joi.string().required().min(3).max(100),
    description: Joi.string().required().min(5).max(1000),
    img: Joi.string().required(),
    price: Joi.number().required(),
    color: Joi.array().required(),
    size: Joi.array().required(),
    rating: Joi.number().required(),
    categories: Joi.array().required(),
    inStock: Joi.boolean(),
    numberInStock: Joi.number().min(1).max(200).required(),
  });
  return schema.validate(product);
}
module.exports.Product = mongoose.model('Product', productSchema);
module.exports.validateProduct = validateProduct;
