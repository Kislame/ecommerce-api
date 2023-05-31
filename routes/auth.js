const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models/User');
const authController = require('../controllers/authController');

router.post('/', authController.login_post);

module.exports = router;
