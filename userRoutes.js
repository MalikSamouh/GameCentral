const express = require('express');
const router = express.Router();
const userController = require('./Controller/userController');
const productController = require('./Controller/productController');


// User routes
router.post('/register', userController.registerUser);
router.post('/signin', userController.loginUser);
router.get('/checkLogin',userController.checkLogin);
router.post('/logout', userController.logoutUser);


// Product routes
router.get('/product', productController.getProducts);


module.exports = router;