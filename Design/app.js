const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const pgp = require('pg-promise')();
const connectionString = process.env.DATABASE_URL;
const db = pgp(connectionString);
const homeRoutes = require('./routes/home');
const authenticationRoutes = require('./routes/authentication');
const recipesRoutes = require('./routes/recipes');
const inventoryRoutes = require('./routes/inventory');
const app = express();
const PORT = process.env.PORT || 3000;

// EJS viewset
app.set('view engine', 'ejs');

// Middleware

app.use(session({
    secret: '123456789',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(express.static('public'));

// Database connection middleware
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Routes
app.use('/home', homeRoutes);

app.use('/authentication', authenticationRoutes);

app.use('/recipes', recipesRoutes);

app.use('/inventory', inventoryRoutes);

// Wildcard route to redirect lost users
app.get('*', (req, res) => {
  res.redirect('/authentication/login');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
