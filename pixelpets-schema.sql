CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE pets (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id) NULL, -- Link to the users table, NULL means adoption center
    name VARCHAR(20) UNIQUE NOT NULL, 
    species VARCHAR(20) NOT NULL,
    color VARCHAR(20) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE pet_stats (
    pet_id  PRIMARY KEY REFERENCES pets(id),
    happiness INTEGER NOT NULL,
    hunger INTEGER NOT NULL,
    last_played TIMESTAMP DEFAULT NULL,
    last_fed TIMESTAMP DEFAULT NULL
)