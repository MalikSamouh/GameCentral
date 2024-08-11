const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: new mongoose.Schema({
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        address: {
            type: String,
        },
    }),
    items: [new mongoose.Schema({
        product: [new mongoose.Schema({
            product_name: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
        })],
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    })],
    total_price: {
        type: Number,
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
    },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
