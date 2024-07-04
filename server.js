const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from the public directory

const db = mysql.createConnection({
    /**
     * NOTE: I still need to fix below, so we can all connect to it
     */
    host: 'localhost',
    user: 'yourUsername',
    password: 'yourPassword',
    database: 'yourDatabase'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

app.post('/register', (req, res) => {
    const { role, first_name, last_name, email, address, password } = req.body;
    const sql = 'INSERT INTO user (first_name, last_name, email, address, password) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [role, first_name, last_name, email, address, password], (err, result) => {
        if (err) throw err;
        res.send('User registered successfully');
    });
});

app.post('/signin', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM user WHERE email = ? AND password = ?';
    db.query(sql, [email, password], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
        res.send('User signed in successfully');
        } else {
        res.send('Invalid credentials');
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
