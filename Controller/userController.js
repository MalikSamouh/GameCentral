const bcrypt = require('bcryptjs');
const User = require('../Model/userModel');
const cartController = require('./cartController');

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, billingAddress, city, state, postalCode, country, nameOnCard, cardNumber, cvv, expiryDate  } = req.body;

    const existingUser = await User.findOne.toLowerCase({ email });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).send('Password must be at least 8 characters long, contain a mix of uppercase and lowercase letters, include numbers and symbols.');
    }

    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(password, saltRounds);

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

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send('Email and password are required');
    }

    const lcEmail = email.toLowerCase();
    const user = await User.findOne({ email: lcEmail });
    if (!user) {
      console.log(user);
      console.log(lcEmail);
      console.log('User not found');
      return res.status(400).send('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(400).send('Invalid email or password');
    }

    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.email = user.email;

    req.session.cart = await cartController.loadCart(user._id);

    res.redirect('/shoppingPage');
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send(error.message);
  }
};


exports.logoutUser = async (req, res) => {
  try {
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
    const user = await User.findById(req.session.userId);
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
      res.status(200).json(users);
  } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Failed to fetch users' });
  }
};


exports.updateProfile = async (req, res) => {
  const { username, email, billingAddress, city, state, country, postalCode, cardNumber, nameOnCard, cvv, expiryDate } = req.body;

  try {
    const userId = req.session.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const updateFields = {
      username,
      email,
      billingAddress,
      city,
      state,
      country,
      postalCode,
      cardNumber,
      nameOnCard,
      cvv,
      expiryDate
    };

    const updatedUser = await User.findByIdAndUpdate(userId, { $set: updateFields }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.session.username = updatedUser.username;
    req.session.email = updatedUser.email;

    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

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

        console.log('User updated successfully');

        res.status(200).send({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send({ message: 'Failed to update user information' });
    }
};
