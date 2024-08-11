const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');
const userRoutes = require('./userRoutes');
const User = require('./Model/userModel');

const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

mongoose.connect('mongodb+srv://testing:8gW6ByBqL36rrzoJ@ecommerce.zzyeljs.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error(`Failed to connect to MongoDB: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', userRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'View', 'homePage.html'));
});


app.get('/registerPage', (req, res) => {
  res.sendFile(path.join(__dirname, 'View', 'registerPage.html'));
});

app.get('/shoppingPage', (req, res) => {
  res.sendFile(path.join(__dirname, 'View', 'shoppingPage.html'));
});

app.get('/signinPage', (req, res) => {
  res.sendFile(path.join(__dirname, 'View', 'signinPage.html'));
});
app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'View', 'userHomePage.html'));
});

app.get('/checkoutPage.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'View', 'checkoutPage.html'));
});


const PORT = process.env.PORT || port;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.post('/api/updateProfile', async (req, res) => { //for updating the username and the email address from databse
  const { username, email } = req.body;

  try {
      const userId = req.session.userId;  
      if (!userId) {
          return res.status(401).json({ message: 'Not authenticated' });
      }

      await User.findByIdAndUpdate(userId, { username, email });

      req.session.username = username;
      req.session.email = email;

      res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ message: 'Failed to update profile' });
  }
});




