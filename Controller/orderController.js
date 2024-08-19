const bcrypt = require('bcryptjs');
const Order = require('../Model/orderModel');
const User = require('../Model/userModel');
const Product = require('../Model/productModel');
const Cart = require('../Model/cartModel')
const { ObjectId } = require('mongodb');

exports.putOrder = async (req, res) => {
    try {
        const { userEmail, name, billingAddress, city, state, postalCode, country, cart, totalPrice } = req.body;
        const user = await User.findOne({ email: userEmail });
        const userFullAdress = {
            address: billingAddress,
            city,
            state,
            postalCode,
            country,
        };
        const order = new Order({
          user,
          items: cart,
          total_price: totalPrice,
          status: false,
          user_address: userFullAdress,
        });
        await order.save();

        await Cart.findOneAndUpdate(
            { user: user._id },
            { $set: { items: [] } }
        );
        
        req.session.cart = [];

        res.status(200).json({ message: 'Order placed successfully', order });
      } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
      }
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