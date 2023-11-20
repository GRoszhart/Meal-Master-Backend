const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database/db');
const authenticationRoutes = require('./routes/authentication');
const app = express();
const PORT = process.env.PORT || 3000;

// EJS
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Database connection middleware
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Routes
const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

app.use('/authentication', authenticationRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
