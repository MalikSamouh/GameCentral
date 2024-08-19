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

        // Clear the cart in the database
        await Cart.findOneAndUpdate(
            { user: user._id },
            { $set: { items: [] } }
        );
        
        // Clear the cart in the session
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

exports.updateOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const updatedOrderData = req.body;

        // Find the order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update order details
        order.user.username = updatedOrderData.user.username;
        order.user.email = updatedOrderData.user.email;
        order.user_address = updatedOrderData.user_address;
        order.status = updatedOrderData.status;

        // Save the updated order
        await order.save();

        // Update the user information if it has changed
        const user = await User.findOne({ email: order.user.email });
        if (user) {
            user.username = updatedOrderData.user.username;
            user.email = updatedOrderData.user.email;
            user.billingAddress = updatedOrderData.user_address.address;
            user.city = updatedOrderData.user_address.city;
            user.state = updatedOrderData.user_address.state;
            user.postalCode = updatedOrderData.user_address.postalCode;
            user.country = updatedOrderData.user_address.country;
            await user.save();
        }

        res.status(200).json({ message: 'Order updated successfully', order });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ message: 'An error occurred while updating the order' });
    }
};