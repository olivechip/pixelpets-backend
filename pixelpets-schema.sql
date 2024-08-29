CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(20) NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL
);