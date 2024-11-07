const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Pet = require('../models/pet');

// Get all users (for testing/admin purposes, might need authentication later)
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users.rows);
    } catch (error) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// moved to unprotected
// Search for users by keyword
// router.post('/search', async (req, res) => {
//     try {
//       const { keyword } = req.body; 
//       const users = await User.search(keyword);
//       res.json(users); 
//     } catch (error) {
//       console.error('Error searching for users:', error);
//       res.status(500).json({ error: 'Server error' });
//     }
// });

// Get user by ID
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.find({ id: userId });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error finding user:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get pets owned by current user
router.get('/:userId/pets', async (req, res) => {
    const { userId } = req.params;
    try {
        const pets = await Pet.findByOwnerId(userId);
        res.json(pets);
    } catch (error) {
        console.error('Error fetching pets', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user by ID
router.put('/:userId', async (req, res) => {
    const { userId } = req.params;
    const updates = req.body;

    if (req.user.userId !== parseInt(userId)) {
        return res.status(403).json({ error: 'Forbidden - You can only update your own profile' });
    }

    try {
        const updatedUser = await User.update(userId, updates);
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(400).json({ error: error.message });
    }
});

// Delete user by ID
router.delete('/:userId', async (req, res) => {
    const { userId } = req.params;
    const { username, email, password } = req.body;

    if (req.user.userId !== parseInt(userId)) {
        return res.status(403).json({ error: 'Forbidden - You can only delete your own profile' });
    }

    try {
        const deleted = await User.delete(userId, { username, email, password });

        if (deleted) {
            res.status(200).json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;