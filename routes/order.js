const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

//get orders list
router.get('/', orderController.order_list);

//user create order
router.post('/', orderController.order_create);

//get income

router.get('/income', orderController.get_income);

//get user order
router.get('/:id', orderController.order_user_get);

//update order

router.put('/:id', orderController.order_update);

//delete order
router.delete('/:id', orderController.order_delete);

module.exports = router;
