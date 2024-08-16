const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  billingAddress: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  postalCode: {
    type: String,
  },
  country: {
    type: String,
  },
  cardNumber: {
    type: Number,
  },
  nameOnCard: {
    type: String,
  },
  cvv: {
    type: Number,
  },
  expiryDate: {
    type: String,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
