CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE pets (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL, -- Link to the users table, NULL means adoption center
    name VARCHAR(50) UNIQUE NOT NULL, 
    species VARCHAR(20) NOT NULL,
    color VARCHAR(20) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    happiness INTEGER NOT NULL CHECK (happiness >= 0 AND happiness <= 100), 
    hunger INTEGER NOT NULL CHECK (hunger >= 0 AND hunger <= 100),
    last_played TIMESTAMP DEFAULT NULL, -- default to null on pet creation
    last_fed TIMESTAMP DEFAULT NULL, -- default to null on pet creation
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE adoption_center (
    pet_id INTEGER PRIMARY KEY REFERENCES pets(id) ON DELETE CASCADE,
    posted_at TIMESTAMP NOT NULL DEFAULT NOW()
);