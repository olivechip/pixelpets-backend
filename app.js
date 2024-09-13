/** Express app for Pixelpets. */

require('dotenv').config()
const express = require('express');
const app = express();
const authRequired = require('./middleware/auth');
const userRoutes = require('./routes/userRoutes');
const petRoutes = require('./routes/petRoutes');
const poundRoutes = require('./routes/poundRoutes');

app.use(express.json());

// Unprotected Routes
app.get('/', (req, res) => {
    res.json('Welcome to Pixelpets!');
});

// Semi-protected Routes
app.use('/users', userRoutes);
app.use('/pets', petRoutes);

// Fully Protected Routes
app.use('/pound', authRequired, poundRoutes);

// Server info
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;