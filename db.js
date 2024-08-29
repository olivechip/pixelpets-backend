/** Database config for Pixelpets. */

const { Client } = require('pg');

const DB_URI = process.env.NODE_ENV === 'test' ? 'pixelpets_test' : 'pixelpets';

const db = new Client({
    host: '/var/run/postgresql',
    database: DB_URI
});

db.connect();

module.exports = db;