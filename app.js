const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const userRoutes = require('./backend/userRoutes');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
mongoose.connect('mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.log(`Failed to connect to MongoDB: ${err}`);
});

// Routes
app.use('/api', userRoutes);

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'homePage.html'));
});

app.get('/registerPage', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'registerPage.html'));
});

app.get('/signinPage', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'signinPage.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
