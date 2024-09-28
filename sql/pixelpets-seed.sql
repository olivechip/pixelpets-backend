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

INSERT INTO pets (owner_id, name, species, color, gender, img_url, happiness, hunger, popularity, created_at, updated_at)
VALUES 
        ((SELECT id FROM users WHERE id = 1), 'Fluffy', 'kougra', 'yellow', 'f', '/src/assets/pixelpets/colored/kougra_yellow_female.png', 100, 100, 0, NOW(), NOW()),
        ((SELECT id FROM users WHERE id = 2), 'Buddy', 'techo', 'blue', 'm', '/src/assets/pixelpets/colored/techo_blue_male.png', 50, 50, 0, NOW(), NOW()),
        ((SELECT id FROM users WHERE id = 2), 'Goldie', 'vandagyre', 'yellow', 'f', '/src/assets/pixelpets/colored/vandagyre_yellow_female.png', 70, 50, 0, NOW(), NOW()),
        (NULL, 'Patches', 'moehog', 'red', 'm', '/src/assets/pixelpets/colored/moehog_red_male.png', 0, 0, (random() * 4 + 1)::int, NOW(), NOW()), 
        (NULL, 'Whiskers', 'xweetok', 'blue', 'f', '/src/assets/pixelpets/colored/xweetok_blue_female.png', 0, 0, (random() * 4 + 1)::int, NOW(), NOW()),
        (NULL, 'Spot', 'nimmo', 'blue', 'm', '/src/assets/pixelpets/colored/nimmo_blue_male.png', 0, 0, (random() * 4 + 1)::int, NOW(), NOW()), 
        (NULL, 'Mittens', 'scorchio', 'red', 'f', '/src/assets/pixelpets/colored/scorchio_red_female.png', 0, 0, (random() * 4 + 1)::int, NOW(), NOW()),
        (NULL, 'Bubbles', 'gelert', 'yellow', 'm', '/src/assets/pixelpets/colored/gelert_yellow_male.png', 0, 0, (random() * 4 + 1)::int, NOW(), NOW()),
        (NULL, 'Tweety', 'jubjub', 'yellow', 'f', '/src/assets/pixelpets/colored/jubjub_yellow_female.png', 0, 0, (random() * 4 + 1)::int, NOW(), NOW()),
        (NULL, 'Hammy', 'kyrii', 'red', 'm', '/src/assets/pixelpets/colored/kyrii_red_male.png', 0, 0, (random() * 4 + 1)::int, NOW(), NOW()),
        (NULL, 'Slither', 'kougra', 'red', 'm', '/src/assets/pixelpets/colored/kougra_red_male.png', 0, 0, (random() * 4 + 1)::int, NOW(), NOW()),
        (NULL, 'Hopper', 'ogrin', 'yellow', 'f', '/src/assets/pixelpets/colored/ogrin_yellow_female.png', 0, 0, (random() * 4 + 1)::int, NOW(), NOW()),
        (NULL, 'Spike', 'kacheek', 'blue', 'm', '/src/assets/pixelpets/colored/kacheek_blue_male.png', 0, 0, (random() * 4 + 1)::int, NOW(), NOW());

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