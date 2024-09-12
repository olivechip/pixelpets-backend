const db = require("../db");

/** Collection of related methods for pets. */

class Pet {
    // Constructor to initialize a Pet instance
    constructor(petData) {
        this.id = petData.id;
        this.owner_id = petData.owner_id;
        this.name = petData.name;
        this.species = petData.species;
        this.color = petData.color;
        this.gender = petData.gender;
        this.happiness = petData.happiness;
        this.hunger = petData.hunger;
        this.last_played = petData.last_played;
        this.last_fed = petData.last_fed;
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
            const result = await db.query('SELECT * FROM pets WHERE id = $1;', [petId]);
            return result.rows[0] || null;
        } catch (error) {
            console.error('Error finding pet by ID:', error);
            throw new Error('Database query failed');
        }
    }

    // Find pets by owner
    static async findByOwnerId(ownerId) {
        try {
            const result = await db.query('SELECT * FROM pets WHERE owner_id = $1;', [ownerId]);
            return result.rows;
        } catch (error) {
            console.error('Error finding pets by owner ID:', error);
            throw new Error('Database query failed');
        }
    }

    // Create a new pet
    static async create({ owner_id, name, species, color, gender }) {
        try {
            const result = await db.query(
                `INSERT INTO pets (owner_id, name, species, color, gender, happiness, hunger, last_played, last_fed, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, 80, 80, NOW(), NOW(), NOW(), NOW())
                RETURNING *;`, 
                [owner_id, name, species, color, gender]
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
            await db.query(
                `UPDATE pets 
                 SET happiness = LEAST(happiness + 20, 100), 
                     hunger = GREATEST(hunger - 10, 0),
                     last_played = NOW() 
                 WHERE id = $1;`,
                [this.id]
            );
            console.log(`You played with ${this.name}!`);
        } catch (error) {
            console.error('Error playing with pet:', error);
            throw new Error('Playing failed');
        }
    }

    // Feed pet (instance method)
    async feed() {
        try {
            await db.query(
                `UPDATE pets 
                 SET hunger = LEAST(hunger + 20, 100), 
                     happiness = LEAST(happiness + 5, 100), 
                     last_fed = NOW() 
                 WHERE id = $1;`,
                [this.id]
            );
            console.log(`${this.name} has been fed!`);
        } catch (error) {
            console.error('Error feeding pet:', error);
            throw new Error('Feeding failed');
        }
    }
}

module.exports = Pet;