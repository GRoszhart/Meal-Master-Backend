// Routes to do with sensitive user info
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

// Route to display register.ejs file from views
router.get('/register', (req, res) => {
    res.render('register');
});

// Route to handle registration
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Hash the password for security
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user data into the users table
        await req.db.none('INSERT INTO users(username, email, password) VALUES($1, $2, $3)', [username, email, hashedPassword]);

        res.send('Registration successful!');
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to display login.ejs file from views
router.get('/login', (req, res) => {
    res.render('login');
});

// Route to handle login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Retrieve user data from the 'users' table
        const user = await req.db.oneOrNone('SELECT * FROM users WHERE username = $1', [username]);

        if (user && await bcrypt.compare(password, user.password)) {
            res.send('Login successful!');
        } else {
            res.status(401).send('Invalid username or password');
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;