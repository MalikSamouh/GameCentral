const bcrypt = require('bcryptjs');
const User = require('../Model/userModel');
const cartController = require('./cartController');

// const Cart = require('../Model/cartModel');
// const Product = require('../Model/productModel');

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }

    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // console.log('Hashed password:', hashedPassword);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.redirect('/signinPage');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.loginUser = async (req, res) => {
  try {
    // ('Request body:', req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send('Email and password are required');
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(400).send('Invalid email or password');
    }

    // console.log('User found:', user);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password does not match');
      // res.status(400).sho
      return res.status(400).send('Invalid email or password');
    }

    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.email = user.email;

    // const cart = await Cart.findOne({ user: user._id }).populate('items.product');
    // req.session.cart = cart ? cart.items : [];
    req.session.cart = await cartController.loadCart(user._id);

    res.redirect('/shoppingPage');
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send(error.message);
  }
};


exports.logoutUser = async (req, res) => {
  try {
    // Save the cart to the database before destroying the session
    if (req.session.userId && req.session.cart) {
      await cartController.saveCart(req.session.userId, req.session.cart);
    }

    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).send('Error logging out');
      }
      res.redirect('/');
    });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).send(error.message);
  }
};

exports.checkLogin = (req, res) => {
  if (req.session.userId) {
    // (req.session);
    res.json({ isLoggedIn: true, username: req.session.username, email: req.session.email });
} else {
    res.json({ isLoggedIn: false });
}
};


exports.getUserProfile = (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send('Not authenticated');
  }
  res.json({ username: req.session.username });
};

exports.getAllUsers = async (req, res) => {
  try {
      const users = await User.find({});
      res.status(200).send(users);
  } catch (error) {
      res.status(500).send(error.message);
  }
};
