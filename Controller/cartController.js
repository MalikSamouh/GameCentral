const Cart = require('../Model/cartModel');
const Product = require('../Model/productModel');

exports.addToCart = async (req, res) => {
  try {
    const { productName, quantity } = req.body;
    const product = await Product.findOne({ product_name: productName });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!req.session.cart) {
      req.session.cart = [];
    }

    const existingItem = req.session.cart.find(item => item.product.product_name === productName);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      req.session.cart.push({
        product: product,
        quantity: quantity
      });
    }

    res.status(200).json({ message: 'Product added to cart', cart: req.session.cart });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Error adding to cart' });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productName } = req.body;

    if (!req.session.cart) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const itemIndex = req.session.cart.findIndex(item => item.product.product_name === productName);

    if (itemIndex > -1) {
      req.session.cart[itemIndex].quantity -= 1;
      if (req.session.cart[itemIndex].quantity === 0) {
        req.session.cart.splice(itemIndex, 1);
      }
    }

    res.status(200).json({ message: 'Product removed from cart', cart: req.session.cart });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Error removing from cart' });
  }
};

exports.getCart = async (req, res) => {
  try {
    if (!req.session.cart) {
      req.session.cart = [];
    }
    res.status(200).json({ cart: req.session.cart });
  } catch (error) {
    console.error('Error getting cart:', error);
    res.status(500).json({ message: 'Error getting cart' });
  }
};

exports.saveCart = async (userId, cart) => {
  try {
    await Cart.findOneAndUpdate(
      { user: userId },
      { items: cart },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error('Error saving cart:', error);
    throw error;
  }
};

exports.loadCart = async (userId) => {
  try {
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    return cart ? cart.items : [];
  } catch (error) {
    console.error('Error loading cart:', error);
    throw error;
  }
};