// Routes to do with recipes
const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Route to render the recipes page
router.get('/', async (req, res) => {
  try {
    const recipes = await db.any('SELECT * FROM Recipe');
    res.render('recipes', { recipes });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to render the recipeDetails page for a specific recipe by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const recipe = await db.oneOrNone('SELECT * FROM Recipe WHERE id = $1', id);
    if (recipe) {
      res.render('recipeDetails', { recipe });
    } else {
      res.status(404).send('Recipe not found');
    }
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;