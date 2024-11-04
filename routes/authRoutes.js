const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { generateToken, generateRefreshToken } = require('./authService');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

// Register route
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const { token, refreshToken, expirationTime, refreshTokenExpirationTime, user } = await User.register({ username, email, password });
        res.status(201).json({ token, refreshToken, expirationTime, refreshTokenExpirationTime, user });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(400).json({ error: error.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const { token, refreshToken, expirationTime, refreshTokenExpirationTime, user } = await User.login({ email, password });
        res.json({ token, refreshToken, expirationTime, refreshTokenExpirationTime, user });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(401).json({ error: error.message });
    }
});

// Refresh Token
router.post('/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;
    
        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is required' });
        }
  
        // Verify the refresh token
        jwt.verify(refreshToken, JWT_SECRET, (error, user) => { 
            if (error) {
                return res.status(403).json({ message: 'Invalid refresh token' });
            }
  
            // Generate a new access token and refresh token
            const { token, expirationTime } = generateToken(user); 
            const { refreshToken: newRefreshToken, refreshTokenExpirationTime } = generateRefreshToken(user);
  
            // Send the new tokens and expiration times
            res.json({ 
                token, 
                expirationTime, 
                refreshToken: newRefreshToken,
                refreshTokenExpirationTime 
            }); 
        });
    } catch (error) {
        console.error('Error refreshing token:', error);
        res.status(500).json({ message: 'Failed to refresh token' });
    }
});

module.exports = router;