/** Express app for Pixelpets. */

require('dotenv').config()
const express = require('express');
const app = express();

const User = require('./models/user');
const Pet = require('./models/pet');

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

app.get('/admin', async (req, res) => {
  try {
    const users = await User.findAll(); 
    const pets = await Pet.findAll();
    res.json([users.rows, pets.rows]);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Server Error' }); 
  }
});

app.use('/auth', authRoutes);

// Test Route
app.get('/auth', async (req, res) => {
  res.status(200).json('You have reach the /auth route');
});

// Fully Protected Routes
app.use('/users', authRequired, userRoutes);
app.use('/pets', authRequired, petRoutes);
app.use('/pound', authRequired, poundRoutes);

// Server info
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;