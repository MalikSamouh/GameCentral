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

    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // console.log('Hashed password:', hashedPassword);

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
  const { userId, username, email, address, city, state, country, postalCode, cardNumber, nameOnCard, cvv, expiryDate } = req.body;

  try {
    // Check if the logged-in user is an admin or if they are updating their own profile
    const currentUserId = req.session.userId;
    const currentUser = await User.findById(currentUserId);

    if (!currentUser || (!currentUser.isAdmin && currentUserId !== userId)) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Update the user's profile
    await User.findByIdAndUpdate(userId, { 
      username, 
      email, 
      billingAddress: address, 
      city, 
      postalCode, 
      state, 
      country, 
      cardNumber, 
      nameOnCard, 
      cvv, 
      expiryDate 
    });

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};
// Controller/userController.js

//const User = require('../Model/userModel');

exports.updateUserById = async (req, res) => {
    const userId = req.params.userId;
    const updatedUserData = req.body;
    console.log('Update Request for User ID:', userId);
    console.log('Updated Data:', updatedUserData);
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Update user fields
        user.username = updatedUserData.username || user.username;
        user.billingAddress = updatedUserData.billingAddress || user.billingAddress;
        user.city = updatedUserData.city || user.city;
        user.state = updatedUserData.state || user.state;
        user.country = updatedUserData.country || user.country;
        user.postalCode = updatedUserData.postalCode || user.postalCode;
        user.nameOnCard = updatedUserData.nameOnCard || user.nameOnCard;
        user.cardNumber = updatedUserData.cardNumber || user.cardNumber;
        user.cvv = updatedUserData.cvv || user.cvv;
        user.expiryDate = updatedUserData.expiryDate || user.expiryDate;

        await user.save();
        console.log('User updated successfully');

        res.status(200).send({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send({ message: 'Failed to update user information' });
    }
};
