/** Express app for Pixelpets. */

require('dotenv').config()
const express = require('express');
const app = express();

// Added 2024.10.10 - mentor helpimport cors from 'cors'; // CORS middleware
import cors from 'cors'; // CORS middleware
import cookieParser from 'cookie-parser'; // Cookie parser middleware
import bodyParser from 'body-parser'; // Body parser middleware
import session from 'express-session'; // Session middleware

const User = require('./models/user');
const Pet = require('./models/pet');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const petRoutes = require('./routes/petRoutes');
const poundRoutes = require('./routes/poundRoutes');
const { authRequired } = require('./middleware/auth');

app.use(express.json());

// Added 2024.10.10 - mentor help
app.use(
  cors({
    AccessControlAllowOrigin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://pixelpets-frontend.onrender.com/",
      "https://pixelpets-backend.onrender.com/",
    ],
    // origin:"https://front-end-4ytj.onrender.com",
    origin: "http://localhost:3000",
    methods: ("GET", "POST", "PUT", "DELETE"),
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser());
app.set('trust proxy', true)
app.use(
  session({
    // store: new RedisStore({ client: redisClient }),
    key: "user",
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: false, // Ensure cookies are only sent over HTTPS in production
      sameSite: "none", // Prevents CSRF attacks; use 'strict' in production,
      expires: 1000 * 60 * 60 * 24,
    },
  })
);


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