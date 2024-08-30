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

INSERT INTO pets (owner_id, name, species, color, gender, happiness, hunger, last_played, last_fed, created_at, updated_at)
VALUES 
        ((SELECT id FROM users WHERE id = 1), 'Fluffy', 'Cat', 'White', 'f', 100, 100, NULL, NULL, NOW(), NOW()),
        ((SELECT id FROM users WHERE id = 2), 'Buddy', 'Dog', 'Brown', 'm', 50, 50, NOW(), NOW(), NOW(), NOW()),
        ((SELECT id FROM users WHERE id = 2), 'Goldie', 'Fish', 'Gold', 'f', 70, 50, NOW(), NOW(), NOW(), NOW()),
        (NULL, 'Patches', 'Dog', 'grey', 'm', 80, 30, NOW(), NOW(), NOW(), NOW()), 
        (NULL, 'Whiskers', 'Cat', 'black', 'f', 90, 60, NOW(), NOW(), NOW(), NOW());

INSERT INTO adoption_center (pet_id, posted_at) 
VALUES 
        (4, NOW()), 
        (5, NOW());