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

INSERT INTO pets (owner_id, name, species, color, gender, happiness, hunger, popularity, created_at, updated_at)
VALUES 
        ((SELECT id FROM users WHERE id = 1), 'Fluffy', 'Cat', 'White', 'f', 100, 100, 0, NOW(), NOW()),
        ((SELECT id FROM users WHERE id = 2), 'Buddy', 'Dog', 'Brown', 'm', 50, 50, 0, NOW(), NOW()),
        ((SELECT id FROM users WHERE id = 2), 'Goldie', 'Fish', 'Gold', 'f', 70, 50, 0, NOW(), NOW()),
        (NULL, 'Patches', 'Dog', 'Grey', 'm', 0, 0, (random() * 4 + 1)::int, NOW(), NOW()), 
        (NULL, 'Whiskers', 'Cat', 'Black', 'f', 0, 0, (random() * 4 + 1)::int, NOW(), NOW()),
        (NULL, 'Spot', 'Dog', 'Black & White', 'm', 0, 0, (random() * 4 + 1)::int, NOW(), NOW()), 
        (NULL, 'Mittens', 'Cat', 'Calico', 'f', 0, 0, (random() * 4 + 1)::int, NOW(), NOW()),
        (NULL, 'Bubbles', 'Fish', 'Orange', 'm', 0, 0, (random() * 4 + 1)::int, NOW(), NOW()),
        (NULL, 'Tweety', 'Bird', 'Yellow', 'f', 0, 0, (random() * 4 + 1)::int, NOW(), NOW()),
        (NULL, 'Hammy', 'Hamster', 'Brown', 'm', 0, 0, (random() * 4 + 1)::int, NOW(), NOW()),
        (NULL, 'Slither', 'Snake', 'Green', 'm', 0, 0, (random() * 4 + 1)::int, NOW(), NOW()),
        (NULL, 'Hopper', 'Rabbit', 'White', 'f', 0, 0, (random() * 4 + 1)::int, NOW(), NOW()),
        (NULL, 'Spike', 'Hedgehog', 'Brown', 'm', 0, 0, (random() * 4 + 1)::int, NOW(), NOW());

INSERT INTO pet_interactions (pet_id, user_id, interaction_type, timestamp)
VALUES 
    -- Fluffy
    (1, 1, 'feed', '2024-09-15 10:30:00'),
    (1, 1, 'play', '2024-09-13 18:20:00'),

    -- Buddy
    (2, 2, 'play', '2024-09-15 08:15:00'),

    -- Goldie
    (3, 2, 'feed', '2024-09-13 14:00:00');

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