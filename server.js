const express = require('express');
// const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const userRoutes = require('./userRoutes');

const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json()); // bodyParser
app.use(express.urlencoded({ extended: true })); //bodyParser


// Set up session middleware
app.use(session({
  secret: 'your_secret_key', // Replace with a strong, unique secret
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using https
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

  
    // Middleware to parse request bodies
    app.use(express.static(path.join(__dirname, 'public')));
    // app.use(bodyParser.json());
    // app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the public directory
  
  // Routes
  app.use('/api', userRoutes);
  
  // Serve HTML pages
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
  
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  


  