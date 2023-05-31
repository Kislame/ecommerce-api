const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    products: [
      {
        quantity: { type: Number, required: true, default: 1 },
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
        title: {
          type: String,
          required: true,
          minLength: 3,
          maxLength: 100,
          unique: true,
        },
        price: { type: Number, required: true },
      },
    ],
    amount: { type: Number, required: true },
    adress: {
      type: new Schema({
        first_name: {
          type: String,
          required: true,
          minLength: 3,
          maxLength: 100,
        },
        last_name: {
          type: String,
          required: true,
          minLength: 3,
          maxLength: 100,
          unique: true,
        },
        street_adress: {
          type: String,
          required: true,
          minLength: 1,
          maxlength: 1000,
        },
        zip_code: {
          type: String,
          minlength: 1,
          maxlength: 1000,
        },
        city: {
          type: String,
          required: true,
          minlength: 1,
          maxlength: 100,
        },
        country: {
          type: String,
          required: true,
          minlength: 1,
          maxlength: 100,
        },
      }),
      required: true,
    },
    status: { type: String, required: true, default: 'pending' },
  },

  { timestamps: true }
);

module.exports.Order = mongoose.model('Order', orderSchema);
