/** Database config for Pixelpets. */

const { Client } = require('pg');
require('dotenv').config();

let db;

// Configuration for db connection
if (process.env.NODE_ENV === 'development') {
    console.log('Connecting to dev db...')
    // local
    db = new Client({
        host: '/var/run/postgresql',
        database: 'pixelpets'
    });
} else {
    console.log('Connecting to prod db...')
    db = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
}

const connectDB = async () => {
    try {
        await db.connect();
        console.log('Connected to the database!');
        return db;
    } catch (err) {
        console.error('Connection error', err.stack);
        throw err;
    }
};


// The following SQL commands only exist to init Render DB
// Comment until 'end' for dev

// Function to execute SQL commands
const executeSQL = async (query) => {
    try {
        const res = await db.query(query);
        return res;
    } catch (err) {
        console.error('SQL error', err.stack);
    }
};

// Function to drop tables
const dropTables = async () => {
    const dropAllTables = `
        DROP TABLE IF EXISTS users, pets, pet_interactions, adoption_center;
    `;

    await executeSQL(dropAllTables);
    console.log('Tables dropped!');
};

// Function to create tables
const createTables = async () => {
    const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL CHECK (LENGTH(username) >= 3),
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        admin BOOLEAN NOT NULL DEFAULT false
    );`;

    const createPetsTable = `
    CREATE TABLE IF NOT EXISTS pets (
        id SERIAL PRIMARY KEY,
        owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        name VARCHAR(50) UNIQUE NOT NULL CHECK (LENGTH(name) >= 3), 
        species VARCHAR(20) NOT NULL,
        color VARCHAR(20) NOT NULL,
        gender VARCHAR(10) NOT NULL,
        img_url VARCHAR(100) NOT NULL,
        happiness INTEGER NOT NULL CHECK (happiness >= 0 AND happiness <= 100), 
        hunger INTEGER NOT NULL CHECK (hunger >= 0 AND hunger <= 100),
        popularity INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );`;

    const createPetInteractionsTable = `
    CREATE TABLE IF NOT EXISTS pet_interactions (
        id SERIAL PRIMARY KEY,
        pet_id INTEGER REFERENCES pets(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        interaction_type VARCHAR(20) NOT NULL,
        timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (pet_id, user_id, interaction_type) 
    );`;

    const createAdoptionCenterTable = `
    CREATE TABLE IF NOT EXISTS adoption_center (
        pet_id INTEGER PRIMARY KEY REFERENCES pets(id) ON DELETE CASCADE,
        posted_at TIMESTAMP NOT NULL DEFAULT NOW()
    );`;

    await executeSQL(createUsersTable);
    await executeSQL(createPetsTable);
    await executeSQL(createPetInteractionsTable);
    await executeSQL(createAdoptionCenterTable);
    console.log('Tables created!');
};

// Function to seed initial data
const seedData = async () => {
    const seedUsers = `
        INSERT INTO users (username, password, email, created_at, updated_at)
        VALUES 
            ('admin', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'admin@email.com', NOW(), NOW(), true),
            ('user1', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'user1@email.com', NOW(), NOW()),
            ('user2', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'user2@email.com', NOW(), NOW());
    `;
    await executeSQL(seedUsers);

    const seedPets = `
        INSERT INTO pets (owner_id, name, species, color, gender, img_url, happiness, hunger, popularity, created_at, updated_at)
        VALUES 
            ((SELECT id FROM users WHERE id = 1), 'Fluffy', 'kougra', 'yellow', 'female', '/images/pixelpets/kougra/happy_female_yellow_kougra.png', 100, 100, 0, NOW(), NOW()),
            ((SELECT id FROM users WHERE id = 2), 'Buddy', 'techo', 'blue', 'male', '/images/pixelpets/techo/happy_male_blue_techo.png', 50, 50, 0, NOW(), NOW()),
            ((SELECT id FROM users WHERE id = 2), 'Goldie', 'vandagyre', 'green', 'female', '/images/pixelpets/vandagyre/happy_female_green_vandagyre.png', 70, 50, 0, NOW(), NOW()),
            (NULL, 'Patches', 'moehog', 'red', 'male', '/images/pixelpets/moehog/happy_male_red_moehog.png', 0, 0, (random() * 4 + 1)::int, NOW(), NOW()), 
            (NULL, 'Whiskers', 'xweetok', 'blue', 'female', '/images/pixelpets/xweetok/happy_female_blue_xweetok.png', 0, 0, (random() * 4 + 1)::int, NOW(), NOW()),
            (NULL, 'Spot', 'nimmo', 'blue', 'male', '/images/pixelpets/nimmo/happy_male_blue_nimmo.png', 0, 0, (random() * 4 + 1)::int, NOW(), NOW()), 
            (NULL, 'Mittens', 'scorchio', 'green', 'female', '/images/pixelpets/scorchio/happy_female_green_scorchio.png', 0, 0, (random() * 4 + 1)::int, NOW(), NOW()),
            (NULL, 'Bubbles', 'gelert', 'yellow', 'male', '/images/pixelpets/gelert/happy_male_yellow_gelert.png', 0, 0, (random() * 4 + 1)::int, NOW(), NOW()),
            (NULL, 'Tweety', 'jubjub', 'yellow', 'female', '/images/pixelpets/jubjub/happy_female_yellow_jubjub.png', 0, 0, (random() * 4 + 1)::int, NOW(), NOW()),
            (NULL, 'Hammy', 'kyrii', 'red', 'male', '/images/pixelpets/kyrii/happy_male_red_kyrii.png', 0, 0, (random() * 4 + 1)::int, NOW(), NOW()),
            (NULL, 'Slither', 'kougra', 'red', 'male', '/images/pixelpets/kougra/happy_male_red_kougra.png', 0, 0, (random() * 4 + 1)::int, NOW(), NOW()),
            (NULL, 'Hopper', 'ogrin', 'yellow', 'female', '/images/pixelpets/ogrin/happy_female_yellow_ogrin.png', 0, 0, (random() * 4 + 1)::int, NOW(), NOW()),
            (NULL, 'Spike', 'kacheek', 'green', 'male', '/images/pixelpets/kacheek/happy_male_green_kacheek.png', 0, 0, (random() * 4 + 1)::int, NOW(), NOW());
    `;
    await executeSQL(seedPets);

    const seedPIs = `
        INSERT INTO pet_interactions (pet_id, user_id, interaction_type, timestamp)
        VALUES 
            (1, 1, 'feed', '2024-09-15 10:30:00+00'),
            (1, 1, 'play', '2024-09-13 18:20:00+00'),
            (2, 2, 'play', '2024-09-15 08:15:00+00'),
            (3, 2, 'feed', '2024-09-13 14:00:00+00');
    `;
    await executeSQL(seedPIs);

    const seedAdoptionCenter = `
        INSERT INTO adoption_center (pet_id, posted_at) 
        VALUES 
            (4, NOW()), 
            (5, NOW()),
            (6, NOW()), 
            (7, NOW()),
            (8, NOW()),
            (9, NOW()),
            (10, NOW()),
            (11, NOW()),
            (12, NOW()),
            (13, NOW());
    `;
    await executeSQL(seedAdoptionCenter);
    console.log('Data seeded!');
};
// end

// Initialize the database
const initializeDB = async () => {
    await connectDB();

    // Comment next 3 lines for Render
    await dropTables();
    await createTables();
    await seedData();

    console.log(`DB initialized on ${db.host}-${db.database}!`)
};

initializeDB();

module.exports = db;