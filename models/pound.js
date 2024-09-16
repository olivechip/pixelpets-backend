const db = require("../db");

class Pound {
    // Find pets for adoption (from the adoption_center table)
    static async findAll() {
        try {
            const result = await db.query('SELECT * FROM pets p JOIN adoption_center ac ON p.id = ac.pet_id;');
            return result.rows;
        } catch (error) {
            console.error('Error finding pets for adoption:', error);
            throw new Error('Database query failed');
        }
    }

    // Abandon a pet (add to the adoption center)
    static async abandon(petId) {
        try {
            await db.query('UPDATE pets SET owner_id = NULL, happiness = 0, hunger = 0 WHERE id = $1;', [petId]);
            await db.query('INSERT INTO adoption_center (pet_id) VALUES ($1);', [petId]);
        } catch (error) {
            console.error('Error abandoning pet:', error);
            throw new Error('Pet abandonment failed');
        }
    }

// Adopt a pet (remove from the adoption center)
    static async adopt(petId, newOwnerId) {
        try {
            await db.query('UPDATE pets SET owner_id = $1 WHERE id = $2;', [newOwnerId, petId]);
            await db.query('DELETE FROM adoption_center WHERE pet_id = $1;', [petId]);
        } catch (error) {
            console.error('Error adopting pet:', error);
            throw new Error('Pet adoption failed');
        }
    }
}

module.exports = Pound;