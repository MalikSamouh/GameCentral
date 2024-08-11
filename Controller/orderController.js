const bcrypt = require('bcryptjs');
const Order = require('../Model/orderModel');
const User = require('../Model/userModel');
const Product = require('../Model/productModel');
const { ObjectId } = require('mongodb');


exports.putOrder = async (req, res) => {
// TODO: add method
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({});
        res.status(200).send(orders);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getOrdersByUserId = async (req, res) => {
    try {
        const userEmail = req.params.id;
        const userOrders = await Order.find({ 'user.email': userEmail });
        res.status(200).send(userOrders);
    } catch (error) {
        res.status(500).send(error.message);
    }
};