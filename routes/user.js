const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.user_list);

router.get('/stats', userController.user_stats);

router.post('/register', userController.user_create_post);

router.get('/:id', userController.user_detail_get);

router.put('/:id', userController.user_update_post);

router.delete('/:id', userController.user_delete);

//routers that require admin users

module.exports = router;
