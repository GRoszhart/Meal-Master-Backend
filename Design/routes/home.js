// Home routes
const express = require('express');
const router = express.Router();
const pgp = require('pg-promise')();
const connectionString = process.env.DATABASE_URL;
const db = pgp(connectionString);

// Main route
router.get('/', (req, res) => {
  const userId = req.session.userId;
  res.render('home', { userId });
});

module.exports = router;