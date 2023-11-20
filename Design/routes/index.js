const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

// Test route
router.get('/', (req, res) => {
  res.send('Welcome to the meal planning app!');
});

module.exports = router;