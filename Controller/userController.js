const bcrypt = require('bcryptjs');
const User = require('../Model/userModel');

exports.registerUser = async (req, res) => {
    // console.log(req); 
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }

    // Define salt rounds
    const saltRounds = 10;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('Hashed password:', hashedPassword); // Debugging line to confirm password hashing

// json, parseJson + stringify
    // Create new user
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
    console.log('Request body:', req.body); // Log the request body

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

    console.log('User found:', user); // Debugging line to confirm user retrieval

    // Compare passwords
    // console.log(password.bcrypt)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(400).send('Invalid email or password');
    }

    // Successful login, redirect to home page
    res.redirect('/');
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send(error.message);
  }
};
