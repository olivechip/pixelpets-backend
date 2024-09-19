const db = require("../db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Pet = require('./pet');
const Pound = require('./pound');


/** Collection of related methods for users. */

class User {

    // Fetch all users
    static async findAll(){
        try {
            const result = db.query(`SELECT id, username, email, created_at, updated_at FROM users;`);
            return result;
        } catch (error) {
            console.error('Error finding users:', error);
            throw new Error('Database query failed');
        }
    }

    // Find user by criteria
    static async find(criteria){
        const keys = Object.keys(criteria);
        const conditions = keys.map((key, index) => `${key} = $${index + 1}`).join(' AND ');

        try {
            const result = await db.query(`SELECT id, username, password, email, created_at, updated_at FROM users WHERE ${conditions}`, Object.values(criteria));
            return result.rows[0] || null;
        } catch (error) {
            console.error('Error finding user:', error);
            throw new Error('Database query failed');
        }
    }

    // Register a new user
    static async register({ username, email, password }) {
        let existingUser = await this.find({ username });
        if (existingUser) throw new Error('Username already exists');

        existingUser = await this.find({ email });
        if (existingUser) throw new Error('Email already exists');

        const hashedPassword = await bcrypt.hash(password, 10);
    
        try {
            const result = await db.query(
                `INSERT INTO users (username, email, password, created_at, updated_at)
                VALUES ($1, $2, $3, NOW(), NOW())
                RETURNING id, username, email, created_at, updated_at;`,
                [username, email, hashedPassword]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error registering user:', error);
            throw new Error('Registration failed');
        }
    }
    
    // Log in user
    static async login({ email, password }) {
        const user = await this.find({ email });
        // console.log(user) // sanity check
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error('Invalid credentials');
        }

        try {
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return { token, user: { id: user.id, username: user.username, email: user.email } };
        } catch (error) {
            console.error('Error logging in:', error);
            throw new Error('Login failed');
        }
    }
    
    // Update user
    static async update(userId, updates) {  
        const keys = Object.keys(updates);  
        
        // Check if password is being updated and hash it  
        if (updates.password) {  
            updates.password = await bcrypt.hash(updates.password, 10);  
        }  
    
        const setClause = keys.map((key, index) => `${key} = $${index + 2}`).join(', ');  
    
        try {  
            const result = await db.query(  
                `UPDATE users SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING id, username, email, created_at, updated_at;`,  
                [userId, ...Object.values(updates)]  
            );  
            return result.rows[0];  
        } catch (error) {  
            console.error('Error updating user:', error);  
            throw new Error('Update failed');  
        } 
    }
    
    // Delete user
    static async delete(userId, { username, email, password }) { 
        try {
            const user = await this.find({ id: userId });
    
            if (!user || user.username !== username || user.email !== email || !(await bcrypt.compare(password, user.password))) {
                throw new Error('Invalid credentials');
            }

            const userPets = await Pet.findByOwnerId(userId);
            console.log(userPets)
            const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id;', [userId]);
            if (result.rowCount > 0) {
                for (const pet of userPets) {
                    await Pound.abandon(pet.id); 
                }
            }
    
            return result.rowCount > 0;
        } catch (error) {
            console.error('Error deleting user:', error.stack);
            if (error.message === 'Invalid credentials') {
                throw error; 
            } else {
                throw new Error('Deletion failed');
            }
        }
    }
}


module.exports = User;
