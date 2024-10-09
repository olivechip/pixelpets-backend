/** Database config for Pixelpets. */

const { Client } = require('pg');
require('dotenv').config();

// Determine the database URI based on the environment
let DB_URI; 

if (process.env.NODE_ENV === 'test') {
    // Use the test database URI if in test mode
    DB_URI = process.env.TEST_DATABASE_URL || 'pixelpets_test'; // fallback to local if not set
} else {
    // Use the production or development database URI
    DB_URI = process.env.DATABASE_URL || 'pixelpets'; // fallback for local dev
}

// Configuration for db connection
const dbConfig = {
    host: process.env.NODE_ENV === 'development' ? '/var/run/postgresql' : undefined,
    connectionString: process.env.NODE_ENV === 'development' ? undefined : DB_URI,
    ssl: process.env.NODE_ENV !== 'development' ? { rejectUnauthorized: false } : undefined,
};

const db = new Client(dbConfig);

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

// Comment out for dev - start
// // Function to execute SQL commands
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
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
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
            ('user1', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'user1@email.com', NOW(), NOW()),
            ('user2', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'user2@email.com', NOW(), NOW());
    `;
    await executeSQL(seedUsers);

    const seedPets = `
        INSERT INTO pets (owner_id, name, species, color, gender, img_url, happiness, hunger, popularity, created_at, updated_at)
        VALUES 
            (1, 'Fluffy', 'kougra', 'yellow', 'female', '/src/assets/pixelpets/colored/kougra_yellow_female.png', 100, 100, 0, NOW(), NOW()),
            (2, 'Buddy', 'techo', 'blue', 'male', '/src/assets/pixelpets/colored/techo_blue_male.png', 50, 50, 0, NOW(), NOW()),
            (2, 'Goldie', 'vandagyre', 'green', 'female', '/src/assets/pixelpets/colored/vandagyre_green_female.png', 70, 50, 0, NOW(), NOW()),
            (NULL, 'Patches', 'moehog', 'red', 'male', '/src/assets/pixelpets/colored/moehog_red_male.png', 0, 0, (random() * 4 + 1)::int, NOW(), NOW()), 
            (NULL, 'Whiskers', 'xweetok', 'blue', 'female', '/src/assets/pixelpets/colored/xweetok_blue_female.png', 0, 0, (random() * 4 + 1)::int, NOW(), NOW()),
            (NULL, 'Spot', 'nimmo', 'blue', 'male', '/src/assets/pixelpets/colored/nimmo_blue_male.png', 0, 0, (random() * 4 + 1)::int, NOW(), NOW()), 
            (NULL, 'Mittens', 'scorchio', 'green', 'female', '/src/assets/pixelpets/colored/scorchio_green_female.png', 0, 0, (random() * 4 + 1)::int, NOW(), NOW()),
            (NULL, 'Bubbles', 'gelert', 'yellow', 'male', '/src/assets/pixelpets/colored/gelert_yellow_male.png', 0, 0, (random() * 4 + 1)::int, NOW(), NOW()),
            (NULL, 'Tweety', 'jubjub', 'yellow', 'female', '/src/assets/pixelpets/colored/jubjub_yellow_female.png', 0, 0, (random() * 4 + 1)::int, NOW(), NOW()),
            (NULL, 'Hammy', 'kyrii', 'red', 'male', '/src/assets/pixelpets/colored/kyrii_red_male.png', 0, 0, (random() * 4 + 1)::int, NOW(), NOW()),
            (NULL, 'Slither', 'kougra', 'red', 'male', '/src/assets/pixelpets/colored/kougra_red_male.png', 0, 0, (random() * 4 + 1)::int, NOW(), NOW()),
            (NULL, 'Hopper', 'ogrin', 'yellow', 'female', '/src/assets/pixelpets/colored/ogrin_yellow_female.png', 0, 0, (random() * 4 + 1)::int, NOW(), NOW()),
            (NULL, 'Spike', 'kacheek', 'green', 'male', '/src/assets/pixelpets/colored/kacheek_green_male.png', 0, 0, (random() * 4 + 1)::int, NOW(), NOW());
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

// Initialize the database
const initializeDB = async () => {
    await connectDB();
    await dropTables();
    await createTables();
    await seedData();
    console.log(`DB initialized on ${DB_URI}!`)
};

initializeDB();
// Comment out for dev - end

// Comment in for dev 
// connectDB();

module.exports = db;

// Comment out for dev
module.exports = { db, executeSQL, initializeDB };