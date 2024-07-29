const express = require('express');
const router = express.Router();
const userController = require('../Controller/userController');
const productController = require('../controllers/productController');


router.post('/register', userController.registerUser);
router.post('/signin', userController.loginUser);
router.get('/', productController.getProducts);


module.exports = router;
