-- both test users have the password "password"

INSERT INTO users (username, password, email, created_at, updated_at)
VALUES 
        ('user1',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'user1@email.com',
        NOW(),
        NOW()),
       ('user2',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'user2@email.com',
        NOW(),
        NOW());

INSERT INTO pets (owner_id, name, species, color, gender, created_at, updated_at)
VALUES  
        ((SELECT id FROM users WHERE id = 1), 'Fluffy', 'Cat', 'White', 'f', NOW(), NOW()),
        ((SELECT id FROM users WHERE id = 2), 'Buddy', 'Dog', 'Brown', 'm', NOW(), NOW()),
        ((SELECT id FROM users WHERE id = 2), 'Goldie', 'Fish', 'Gold', 'f', NOW(), NOW());