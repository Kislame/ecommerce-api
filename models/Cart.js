const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
  },

  { timestamps: true }
);

module.exports.Cart = mongoose.model('Cart', cartSchema);
