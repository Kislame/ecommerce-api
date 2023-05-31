const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

//get user cart
router.get('/mycart', cartController.cart_get);

// get cart list
router.get('/list', cartController.cart_list);

//create cart
router.post('/', cartController.cart_create);

//update cart
router.put('/:id', cartController.cart_update);

//delete cart
router.delete('/:id', cartController.cart_delete);

module.exports = router;
