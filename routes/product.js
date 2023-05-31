const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

//create new product
router.post('/', productController.product_create_post);

//get product list
router.get('/', productController.product_list);

//update a product
router.put('/:id', productController.product_update_put);

//deleted a product
router.delete('/:id', productController.product_delete);

//get product details
router.get('/:id', productController.product_get);

module.exports = router;
