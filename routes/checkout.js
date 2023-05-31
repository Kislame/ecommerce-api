const router = require('express').Router();
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SK);
const auth = require('../middleware/auth');
const { Product } = require('../models/Product');

router.get('/order/success', async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

  res.send(`<html><body><h1>Thanks for your order, !</h1></body></html>`);
});

router.post('/payment', auth, async (req, res) => {
  try {
    const cartItems = req.body.products;
    const ids = req.body.ids;

    const products = await Product.find({
      _id: { $in: ids },
    })
      .lean()
      .select('title price');

    const orderItems = products.map((item) => {
      const match = cartItems.find(
        (product) => product._id === item._id.toString()
      );
      if (match) {
        let obj = {
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.title,
            },
            unit_amount: item.price * 100,
          },
          quantity: match.quantity,
        };
        return obj;
      }
    });

    const session = await stripe.checkout.sessions.create({
      line_items: orderItems,
      mode: 'payment',
      success_url:
        'http://localhost:3000/api/checkout/order/success?session_id={CHECKOUT_SESSION_ID}',
      // cancel_url: 'cancel url',
    });

    res.status(200).json({ url: session.url });
  } catch (ex) {
    res.status(500).send(ex);
  }
});
module.exports = router;
