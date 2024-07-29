const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const userRoutes = require('./backend/userRoutes');

const app = express();

// Middleware to parse request bodies
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
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

// Routes
app.use('/api', userRoutes);

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'View', 'homePage.html'));
});

app.get('/registerPage', (req, res) => {
  res.sendFile(path.join(__dirname, 'View', 'registerPage.html'));
});

app.get('/signinPage', (req, res) => {
  res.sendFile(path.join(__dirname, 'View', 'signinPage.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
