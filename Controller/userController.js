const bcrypt = require('bcryptjs');
const User = require('../Model/userModel');
const cartController = require('./cartController');

// const Cart = require('../Model/cartModel');
// const Product = require('../Model/productModel');

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, billingAddress, city, state, postalCode, country, nameOnCard, cardNumber, cvv, expiryDate  } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).send('Password must be at least 8 characters long, contain a mix of uppercase and lowercase letters, include numbers and symbols.');
    }

    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    consol.log(admin)

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      billingAddress,
      city,
      state,
      postalCode,
      country,
      nameOnCard, 
      expiryDate, 
      cvv,
      cardNumber,
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

exports.checkLogin = async (req, res) => {
  if (req.session.userId) {
    // (req.session);
    const user = await User.findOne({ username: req.session.username });
    res.json({ isLoggedIn: true, username: req.session.username, email: req.session.email, user: user });
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

exports.updateProfile = async (req, res) => {
  const { username, email, address, city, state, country, postalCode, cardNumber, nameOnCard, cvv, expiryDate } = req.body;

  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    await User.findByIdAndUpdate(userId, { username, email, billingAddress: address, city, postalCode, state, country, cardNumber, nameOnCard, cvv, expiryDate });

    req.session.username = username;
    req.session.email = email;

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

