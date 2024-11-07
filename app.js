/** Express app for Pixelpets. */

const express = require('express');
const app = express();
const cors = require("cors");
require('dotenv').config()

const User = require('./models/user');
const Pet = require('./models/pet');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const petRoutes = require('./routes/petRoutes');
const poundRoutes = require('./routes/poundRoutes');
const { authRequired } = require('./middleware/auth');

const corsOptions = {
  origin: ['https://pixelpets-frontend.onrender.com', 'http://localhost:3000']
};

app.use(cors(corsOptions));
app.use(express.json());


// Unprotected Routes
app.get('/', (req, res) => {
  res.json('Welcome to Pixelpets!');
});

// Full search of all users/pets (testing purposes)
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

// Search for all pets for featured
app.get('/pets/featured', async (req, res) => {
  try {
    const pets = await Pet.findAll();
    res.json(pets.rows);
  } catch (error) {
    console.error('Error searching for pets:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Search for pets by keyword
app.post('/pets/search', async (req, res) => {
  try {
    const { keyword } = req.body;
    const pets = await Pet.search(keyword);
    res.json(pets);
  } catch (error) {
    console.error('Error searching for pets:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Search for users by keyword
app.post('/users/search', async (req, res) => {
  try {
    const { keyword } = req.body;
    const users = await User.search(keyword);
    res.json(users);
  } catch (error) {
    console.error('Error searching for users:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Auth Routes
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