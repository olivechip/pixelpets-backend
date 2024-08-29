/** Express app for Pixelpets. */

const express = require('express');
const app = express();

app.use(express.json());

const userRoutes = require('./routes/userRoutes');

app.use('/users', userRoutes);

app.get('/', (req, res) => {
    res.json('Welcome to Pixelpets!');
});

module.exports = app;