/** Database config for Pixelpets. */

const { Client } = require('pg');
require('dotenv').config();

// Determine the database URI based on the environment
let DBI_URI; 

if (process.env.NODE_ENV === 'test') {
    // Use the test database URI if in test mode
    DB_URI = process.env.TEST_DATABASE_URL || 'pixelpets_test'; // fallback to local if not set
} else {
    // Use the production or development database URI
    DB_URI = process.env.DATABASE_URL || 'pixelpets'; // fallback for local dev
}

// Configuration for db connection
const db = new Client(
    process.env.NODE_ENV === 'development'
        ? {
            host: '/var/run/postgresql', // Specify host for local development
            database: DB_URI, // Use the database URI determined earlier
        }
        : {
            connectionString: DB_URI, // Use connection string for production/testing
        }
);

db.connect()
    .then(() => console.log('Connected to the database!'))
    .catch(err => console.error('Connection error', err.stack));

module.exports = db;