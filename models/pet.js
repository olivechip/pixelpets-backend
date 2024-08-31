const db = require("../db");

/** Collection of related methods for pets. */

class Pet {

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

    // Create a new pet
    static async create({ owner_id, name, species, color, gender }) {
        try {
            const result = await db.query(
                `INSERT INTO pets (owner_id, name, species, color, gender, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
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

    // Adoption Methods
    static async findPetsforAdoption(){
        try {
            const result = await db.query('SELECT * FROM pets p JOIN adoption_center ac ON p.id = ac.pet_id;');
            return result.rows;
        } catch (error) {
            console.error('Error finding pets:', error);
            throw new Error('Database query failed');
        }
    }

    static async addToAdoption(petId) {
        try {
            await db.query('UPDATE pets SET owner_id = NULL WHERE id = $1;', [petId]);
            await db.query('INSERT INTO adoption_center (pet_id) VALUES ($1);', [petId]);
        } catch (error) {
            console.error('Error posting pet:', error);
            throw new Error('Pet posting failed');
        }
    }

    static async removeFromAdoption(petId, newOwnerId) {
        try {
            await db.query('UPDATE pets SET owner_id = $1 WHERE id = $2;', [newOwnerId, petId]);
            await db.query('DELETE FROM adoption_center WHERE pet_id = $1;', [petId]);
        } catch (error) {
            console.error('Error adopting pet:', error);
            throw new Error('Pet adoption failed');
        }
    }

    // Feed pet (instance method)
    async feed() {
        // Logic to increase pet's hunger/happiness, update database, etc.
        try {
            await db.query(
                'UPDATE pets SET hunger = hunger + 10, happiness = happiness + 5, last_fed = NOW() WHERE id = $1;',
            [this.id]);
            console.log(`${this.name} has been fed!`);
        } catch (error) {
            console.error('Error feeding pet:', error);
            throw new Error('Feeding failed');
        }
    }

    // Play w/ pet (instance method)
    async play() {
        // Logic to increase pet's happiness, update database, etc.
        try {
            await db.query(
                'UPDATE pets SET happiness = happiness + 20, hunger = hunger - 5, last_played = NOW() WHERE id = $1;',
            [this.id]);
            console.log(`You played with ${this.name}!`);
        } catch (error) {
            console.error('Error playing with pet:', error);
            throw new Error('Playing failed');
        }
    }
}

module.exports = Pet;