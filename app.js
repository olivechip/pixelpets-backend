/** Express app for Pixelpets. */

require('dotenv').config()
const express = require('express');
const app = express();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const petRoutes = require('./routes/petRoutes');
const poundRoutes = require('./routes/poundRoutes');
const { authRequired } = require('./middleware/auth');

app.use(express.json());

// Unprotected Routes
app.get('/', (req, res) => {
    res.json('Welcome to Pixelpets!');
});

// Test Route
app.get('/auth', async (req, res) => {
  res.status(200).json('You have reach the /auth route');
});

app.use('/auth', authRoutes);

// Fully Protected Routes
app.use('/users', authRequired, userRoutes);
app.use('/pets', authRequired, petRoutes);
app.use('/pound', poundRoutes);

// Server info
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;