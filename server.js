const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');
const userRoutes = require('./userRoutes');

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

const PORT = process.env.PORT || port;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
