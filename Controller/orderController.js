const bcrypt = require('bcryptjs');
const Order = require('../Model/orderMaster');

exports.putOrder = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({});
        res.status(200).send(orders);
        return orders;
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getOrdersByUserId = async (req, res) => {
    try {
        const { userId } = req.body;
        const userOrders = await Order.findOne({ user: userId });
        return userOrders;
    } catch (error) {
        res.status(500).send(error.message);
    }
};