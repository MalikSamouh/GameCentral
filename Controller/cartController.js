const Cart = require('../models/cartModel');

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.session.userId }).populate('items.product');
    res.render('cart', { cart });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ user: req.session.userId });

    if (!cart) {
      cart = new Cart({ user: req.session.userId, items: [] });
    }

    const productIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (productIndex >= 0) {
      cart.items[productIndex].quantity += parseInt(quantity, 10);
    } else {
      cart.items.push({ product: productId, quantity: parseInt(quantity, 10) });
    }

    await cart.save();
    res.redirect('/cart');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.updateCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.session.userId });

    const productIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (productIndex >= 0) {
      if (quantity <= 0) {
        cart.items.splice(productIndex, 1);
      } else {
        cart.items[productIndex].quantity = parseInt(quantity, 10);
      }
    }

    await cart.save();
    res.redirect('/cart');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const cart = await Cart.findOne({ user: req.session.userId });

    cart.items = cart.items.filter(item => item.product.toString() !== productId);

    await cart.save();
    res.redirect('/cart');
  } catch (error) {
    res.status(500).send(error.message);
  }
};
