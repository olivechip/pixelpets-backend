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

    // Find a pet by name
    static async findByName(petName) {
        try {
            const result = await db.query('SELECT * FROM pets WHERE name = $1;', [petName]);
            return result.rows[0] || null;
        } catch (error) {
            console.error('Error finding pet by name:', error);
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

    // Update a pet by name
    static async update(petName, updates) {
        const keys = Object.keys(updates);
        const setClause = keys.map((key, index) => `${key} = $${index + 2}`).join(', ');

        try {
            const result = await db.query(
                `UPDATE pets SET ${setClause}, updated_at = NOW() WHERE name = $1 RETURNING *;`,
                [petName, ...Object.values(updates)]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error updating pet:', error);
            throw new Error('Pet update failed');
        }
    }

    // Delete a pet
    static async delete(petName) {
        try {
            const result = await db.query('DELETE FROM pets WHERE name = $1 RETURNING id;', [petName]);
            return result.rowCount > 0;
        } catch (error) {
            console.error('Error deleting pet:', error);
            throw new Error('Pet deletion failed');
        }
    }

//   // Feed a pet (instance method)
//   async feed() {
//     // Logic to increase pet's hunger/happiness, update database, etc.
//     try {
//       // Assuming you have columns like 'hunger' and 'happiness' in your pets table
//       await db.query(
//         'UPDATE pets SET hunger = hunger + 10, happiness = happiness + 5, updated_at = NOW() WHERE id = $1;',
//         [this.id] 
//       );
//       console.log(`${this.name} has been fed!`);
//     } catch (error) {
//       console.error('Error feeding pet:', error);
//       throw new Error('Feeding failed');
//     }
//   }

//   // Play with a pet (instance method)
//   async play() {
//     // Logic to increase pet's happiness, maybe decrease hunger, update database
//     try {
//       await db.query(
//         'UPDATE pets SET happiness = happiness + 15, hunger = hunger - 5, updated_at = NOW() WHERE id = $1;',
//         [this.id]
//       );
//       console.log(`You played with ${this.name}!`);
//     } catch (error) {
//       console.error('Error playing with pet:', error);
//       throw new Error('Playing failed');
//     }
//   }
}

module.exports = Pet;