const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Test route to check if server works
router.get('/', async (req, res) => {
    try {
      const users = await User.findAll(); 
      res.json(users.rows);
    } catch (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ error: 'Server Error' }); 
    }
  });

// Get user by ID
router.get('/:userid', async (req, res) => {
    const { userid } = req.params;
    try {
        const user = await User.find({ id: userid });
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

// Register route
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const newUser = await User.register({ username, email, password });
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(400).json({ error: error.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const { token, user } = await User.login({ email, password });
        res.json({ token, user });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(401).json({ error: error.message });
    }
});

// Update user by ID
router.put('/:userid', async (req, res) => {
    const { userid } = req.params;
    const updates = req.body;
    try {
        const updatedUser = await User.update(userid, updates);
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(400).json({ error: error.message });
    }
});

// Delete user by ID
router.delete('/:userid', async (req, res) => {
    const { userid } = req.params;
    try {
        const success = await User.delete(userid);
        if (success) {
            res.json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;