const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    items: mongoose.Schema({
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    }),
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
