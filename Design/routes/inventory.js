// Routes to do with Inventory
const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Route to view user inventory
router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const inventory = await db.any('SELECT * FROM Inventory WHERE user_id = $1', userId);
        res.render('inventory', { userId, inventory });
    } catch (error) {
        console.error('Error fetching inventory:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Route to view add item form
router.get('/:userId/add', (req, res) => {
    const userId = req.params.userId;
    res.render('addInventoryForm', { userId });
});

// Route to add inventory item
router.post('/:userId/add', async (req, res) => {
    const userId = req.params.userId;
    const { ingredient_name, quantity, unit } = req.body;

    try {
        const newItem = await db.one(
            'INSERT INTO Inventory (user_id, ingredient_name, quantity, unit) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, ingredient_name, quantity, unit]
        );

        res.redirect('/inventory/' + userId);
    } catch (error) {
        console.error('Error adding item to inventory:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Route to view edit item form
router.get('/:userId/:itemId/edit', async (req, res) => {
    const userId = req.params.userId;
    const itemId = req.params.itemId;
    try {
        const item = await db.one('SELECT * FROM Inventory WHERE id = $1 AND user_id = $2', [itemId, userId]);
        res.render('editInventoryForm', { userId, itemId, item });
    } catch (error) {
        console.error('Error fetching item for edit:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to update inventory item with PUT method
router.put('/:userId/:itemId/edit', async (req, res) => {
    const userId = req.params.userId;
    const itemId = req.params.itemId;
    const { ingredient_name, quantity, unit } = req.body;

    try {
        const updatedItem = await db.oneOrNone(
            'UPDATE Inventory SET ingredient_name = $1, quantity = $2, unit = $3 WHERE id = $4 AND user_id = $5 RETURNING *',
            [ingredient_name, quantity, unit, itemId, userId]
        );

        if (updatedItem) {
            res.redirect('/inventory/' + userId);
        } else {
            res.status(404).send('Item not found in inventory');
        }
    } catch (error) {
        console.error('Error updating item in inventory:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to update inventory item with POST method
router.post('/:userId/:itemId/edit', async (req, res) => {
    const userId = req.params.userId;
    const itemId = req.params.itemId;
    const { ingredient_name, quantity, unit } = req.body;

    try {
        const updatedItem = await db.oneOrNone(
            'UPDATE Inventory SET ingredient_name = $1, quantity = $2, unit = $3 WHERE id = $4 AND user_id = $5 RETURNING *',
            [ingredient_name, quantity, unit, itemId, userId]
        );

        if (updatedItem) {
            res.redirect('/inventory/' + userId);
        } else {
            res.status(404).send('Item not found in inventory');
        }
    } catch (error) {
        console.error('Error updating item in inventory:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to delete inventory item
router.post('/:userId/:itemId/delete', async (req, res) => {
    const userId = req.params.userId;
    const itemId = req.params.itemId;

    try {
        const deletedItem = await db.oneOrNone(
            'DELETE FROM Inventory WHERE id = $1 AND user_id = $2 RETURNING *',
            [itemId, userId]
        );

        if (deletedItem) {
            res.redirect('/inventory/' + userId);
        } else {
            res.status(404).send('Item not found in inventory');
        }
    } catch (error) {
        console.error('Error deleting item from inventory:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;