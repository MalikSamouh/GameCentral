const bcrypt = require('bcryptjs');
const User = require('../Model/userModel');

exports.registerUser = async (req, res) => {
    // console.log(req); 
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }

    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('Hashed password:', hashedPassword);

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
      const { email, password } = req.body;

      if (!email || !password) {
          return res.status(400).send('Email and password are required');
      }

      const user = await User.findOne({ email });
      if (!user) {
          return res.status(400).send('Invalid email or password');
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).send('Invalid email or password');
      }

      req.session.userId = user._id;
      req.session.username = user.username;

      // Set the username in localStorage (use client-side JavaScript or cookies for this)
      res.send(`<script>
          localStorage.setItem('username', '${user.username}');
          window.location.href = '/';
      </script>`);
  } catch (error) {
      console.error('Error during login:', error);
      res.status(500).send(error.message);
  }
};



exports.logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).send('Error logging out');
    }
    res.redirect('/');
  });
};

exports.getUserProfile = (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send('Not authenticated');
  }
  res.json({ username: req.session.username });
};