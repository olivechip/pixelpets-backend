/** Express app for Pixelpets. */

require('dotenv').config()
const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');

app.use(express.json());

app.use('/users', userRoutes);

app.get('/', (req, res) => {
    res.json('Welcome to Pixelpets!');
});

// Server info
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;