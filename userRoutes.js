const express = require('express');
const router = express.Router();
const userController = require('./Controller/userController');
const productController = require('./Controller/productController');


// User routes
router.post('/register', userController.registerUser);
router.post('/signin', userController.loginUser);

// Product routes
router.get('/product', productController.getProducts);


module.exports = router;