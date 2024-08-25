const express = require('express');
const router = express.Router();
const userController = require('./Controller/userController');
const cartController = require('./Controller/cartController');
const productController = require('./Controller/productController');
const orderController = require('./Controller/orderController');


// user
router.post('/register', userController.registerUser);
router.post('/signin', userController.loginUser);
router.get('/checkLogin',userController.checkLogin);
router.post('/logout', userController.logoutUser);
router.get('/users', userController.getAllUsers);
router.post('/updateProfile', userController.updateProfile);


// product
router.get('/product', productController.getProducts);
router.put('/product', productController.updateStock);
router.post('/product', productController.removeProductsFromStock);
router.put('/users/:userId', userController.updateUserById);


// cart
router.post('/cart/add', cartController.addToCart);
router.post('/cart/remove', cartController.removeFromCart);
router.get('/cart', cartController.getCart);

// orders
router.post('/orders', orderController.putOrder);
router.get('/orders', orderController.getAllOrders);
router.get('/orders/:id', orderController.getOrdersByUserId);
router.put('/orders/:id', orderController.updateOrder);




module.exports = router;