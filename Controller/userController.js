const bcrypt = require('bcryptjs');
const User = require('../Model/userModel');

exports.registerUser = async (req, res) => {
    console.log(req);
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
    // const hashedPassword = await bcrypt.hash(password, saltRounds);
// json, parseJson + stringify
    // Create new user
    const newUser = new User({

        username,
      email,
      password,
    });

    await newUser.save();
    res.redirect('/registerPage');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('Invalid email or password');
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid email or password');
    }

    // Successful login
    res.send('Login successful');
  } catch (error) {
    res.status(500).send(error.message);
  }
};
