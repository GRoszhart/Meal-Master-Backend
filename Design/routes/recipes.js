// Routes to do with recipes
const express = require('express');
const router = express.Router();
const pgp = require('pg-promise')();
const connectionString = process.env.DATABASE_URL;
const db = pgp(connectionString);

// Route to display recipes
router.get('/', async (req, res) => {
  const userId = req.session.userId;

  // Filter option
  const filterOption = req.query.filter;

  // Inventory filtering options - some ingredients, all ingredients, or show all recipes
  try {
    let recipes;
    if (filterOption === 'someIngredients') {
      recipes = await db.any(
        'SELECT * FROM Recipe WHERE id IN (SELECT DISTINCT recipe_id FROM Ingredients WHERE ingredient_name IN (SELECT ingredient_name FROM Inventory WHERE user_id = $1))',
        [userId]
      );
    } else if (filterOption === 'allIngredients') {
      recipes = await db.any(
        'SELECT * FROM Recipe WHERE NOT EXISTS (SELECT ingredient_name FROM Ingredients WHERE recipe_id = Recipe.id AND ingredient_name NOT IN (SELECT ingredient_name FROM Inventory WHERE user_id = $1))',
        [userId]
      );
    } else {
      recipes = await db.any('SELECT * FROM Recipe');
    }
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