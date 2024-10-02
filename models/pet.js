const db = require("../db");

class Pet {
    // Constructor to initialize a Pet instance
    constructor(petData) {
        this.id = petData.id;
        this.owner_id = petData.owner_id;
        this.name = petData.name;
        this.species = petData.species;
        this.color = petData.color;
        this.gender = petData.gender;
        this.img_url = petData.img_url;
        this.happiness = petData.happiness;
        this.hunger = petData.hunger;
        this.popularity = petData.popularity;
        this.created_at = petData.created_at;
        this.updated_at = petData.updated_at;
    }

    // Fetch all pets
    static async findAll(){
        try {
            const result = db.query(`SELECT * FROM pets;`);
            return result;
        } catch (error) {
            console.error('Error finding pets:', error);
            throw new Error('Database query failed');
        }
    }

    // Find a pet by ID
    static async findById(petId) {
        try {
            const result = await db.query(`
                SELECT 
                    p.*,
                    u.username AS owner_name,
                    MAX(pi.timestamp) FILTER (WHERE pi.interaction_type = 'play') AS last_played,
                    MAX(pi.timestamp) FILTER (WHERE pi.interaction_type = 'feed') AS last_fed
                FROM pets p
                LEFT JOIN users u ON p.owner_id = u.id
                LEFT JOIN pet_interactions pi ON p.id = pi.pet_id 
                WHERE p.id = $1
                GROUP BY p.id, u.username; 
            `, [petId]);
            return result.rows[0] || null;
        } catch (error) {
            console.error('Error finding pet by ID:', error);
            throw new Error('Database query failed');
        }
    }

    // Find pets by owner
    static async findByOwnerId(ownerId) {
        try {
            const result = await db.query(`
                SELECT 
                    p.*,
                    MAX(pi.timestamp) FILTER (WHERE pi.interaction_type = 'play') AS last_played,
                    MAX(pi.timestamp) FILTER (WHERE pi.interaction_type = 'feed') AS last_fed
                FROM pets p
                LEFT JOIN pet_interactions pi ON p.id = pi.pet_id 
                WHERE p.owner_id = $1
                GROUP BY p.id; 
            `, [ownerId]);
            return result.rows;
        } catch (error) {
            console.error('Error finding pets by owner ID:', error);
            throw new Error('Database query failed');
        }
    }

    // Create a new pet
    static async create({ owner_id, name, species, color, gender, img_url }) {
        try {
            const result = await db.query(
                `INSERT INTO pets (owner_id, name, species, color, gender, img_url, happiness, hunger, popularity, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, 80, 80, 0, NOW(), NOW())
                RETURNING *;`, 
                [owner_id, name, species, color, gender, img_url]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error creating pet:', error);
            throw new Error('Pet creation failed');
        }
    }

    // Update a pet
    static async update(petId, updates) {
        const keys = Object.keys(updates);
        const setClause = keys.map((key, index) => `${key} = $${index + 2}`).join(', ');
    
        try {
            const result = await db.query(
                `UPDATE pets SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *;`,
                [petId, ...Object.values(updates)]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error updating pet:', error);
            throw new Error('Pet update failed');
        }
    }

    // Delete a pet
    static async delete(petId) {
        try {
            const result = await db.query('DELETE FROM pets WHERE id = $1 RETURNING id;', [petId]);
            return result.rowCount > 0;
        } catch (error) {
            console.error('Error deleting pet:', error);
            throw new Error('Pet deletion failed');
        }
    }

    // Play w/ pet (instance method)
    async play() {
        try {
            // Check for hunger first
            if (this.hunger === 0) {
                throw new Error(`HungerTooLow: ${this.name} is too hungry to play! Feed them first.`);
            }

            // 1. Insert/update the interaction
            await db.query(
                `
                INSERT INTO pet_interactions (pet_id, user_id, interaction_type, timestamp) 
                VALUES ($1, $2, 'play', NOW())
                ON CONFLICT (pet_id, user_id, interaction_type) DO UPDATE
                SET timestamp = NOW();
                `,
                [this.id, this.owner_id] 
            );
    
            // 2. Update the pet's stats
            await db.query(
                `
                UPDATE pets 
                SET happiness = LEAST(happiness + 20, 100), 
                    hunger = GREATEST(hunger - 10, 0)
                WHERE id = $1;
                `,
                [this.id]
            );
    
            console.log(`You played with ${this.name}!`);
        } catch (error) {
            console.error('Error playing with pet:', error);

            if (error.message.startsWith('HungerTooLow:')) {
                throw error;
            } else {
                throw new Error('Playing failed'); 
            }
        }
    }

    // Feed pet (instance method)
    async feed() {
        try {
            // 1. Insert/update the interaction
            await db.query(
                `
                INSERT INTO pet_interactions (pet_id, user_id, interaction_type, timestamp) 
                VALUES ($1, $2, 'feed', NOW())
                ON CONFLICT (pet_id, user_id, interaction_type) DO UPDATE
                SET timestamp = NOW();
                `,
                [this.id, this.owner_id] 
            );
        
            // 2. Update the pet's stats
            await db.query(
                `
                UPDATE pets 
                SET hunger = LEAST(hunger + 20, 100)
                WHERE id = $1;
                `,
                [this.id]
            );
        
            console.log(`${this.name} has been fed!`);
        } catch (error) {
            console.error('Error feeding pet:', error);
            throw new Error('Feeding failed');
        }
    }

    // Pet another pet (instance method)
    async pet(userId) { 
        try {
            // Check if the user has already petted this pet today
            const today = new Date();
        
            const result = await db.query(
                `SELECT * FROM pet_interactions 
                WHERE pet_id = $1 AND user_id = $2 AND interaction_type = 'pet' 
                AND timestamp >= NOW() - INTERVAL '1 day';`,
                [this.id, userId]
            );
            
            // TESTING! REMOVE THE ! FOR UNLIMITED PETS, ADD ! FOR ONCE A DAY 
            if (result.rows.length === 0) { // User hasn't petted today
                // 1. Insert/update the interaction
                await db.query(
                    `
                    INSERT INTO pet_interactions (pet_id, user_id, interaction_type, timestamp)
                    VALUES ($1, $2, 'pet', NOW())
                    ON CONFLICT (pet_id, user_id, interaction_type) DO UPDATE
                    SET timestamp = NOW();
                    `,
                    [this.id, userId]
                );
        
                // 2. Update the pet's stats
                await db.query(
                    `
                    UPDATE pets 
                    SET popularity = popularity + 1 
                    WHERE id = $1;
                    `,
                    [this.id]
                );
        
                console.log(`You petted ${this.name}!`);
            } else {
                throw new Error('PettingLimitReached: You can only pet this pet once per day');
            }
        } catch (error) {
            console.error('Error petting pet:', error.message);
            if (error.message.startsWith('PettingLimitReached:')) {
                throw error;
            } else {
                throw new Error('Petting failed'); 
            }
        }
    }
}

module.exports = Pet;