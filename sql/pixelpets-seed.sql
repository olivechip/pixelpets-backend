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

INSERT INTO pet_interactions (pet_id, user_id, interaction_type, timestamp)
VALUES 
    -- Fluffy
    (1, 1, 'feed', '2024-09-15 10:30:00+00'),
    (1, 1, 'play', '2024-09-13 18:20:00+00'),

    -- Buddy
    (2, 2, 'play', '2024-09-15 08:15:00+00'),

    -- Goldie
    (3, 2, 'feed', '2024-09-13 14:00:00+00');

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