// Routes to do with sensitive user info
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const pgp = require('pg-promise')();
const connectionString = process.env.DATABASE_URL;
const db = pgp(connectionString);

// Route to display register.ejs file from views
router.get('/register', (req, res) => {
    res.render('register');
});

// Route to handle registration
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await req.db.oneOrNone('SELECT * FROM users WHERE username = $1', [username]);

        if (existingUser) {
            return res.status(400).json('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await req.db.none('INSERT INTO users(username, email, password) VALUES($1, $2, $3)', [username, email, hashedPassword]);

        const registrationSuccess = true;
        res.render('register', { registrationSuccess });
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

        const user = await req.db.oneOrNone('SELECT * FROM users WHERE username = $1', [username]);

        if (user && await bcrypt.compare(password, user.password)) {
            req.session.userId = user.id;
            const loginSuccess = true;
            res.render('login', { loginSuccess });
        } else {
            res.status(401).send('Invalid username or password');
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;