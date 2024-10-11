const db = require("../db");
const bcrypt = require('bcrypt');
const Pet = require('./pet');
const Pound = require('./pound');
const { generateToken, generateRefreshToken } = require('../routes/authService');

/** Collection of related methods for users. */

class User {

    // Fetch all users
    static async findAll(){
        try {
            const result = db.query(`SELECT id, username, email, created_at, updated_at, admin FROM users;`);
            return result;
        } catch (error) {
            console.error('Error finding users:', error);
            throw new Error('Database query failed');
        }
    }

    // Search users by keyword
    static async search(keyword) {
        try {
            const result = await db.query(
                `SELECT * 
                FROM users 
                WHERE username ILIKE $1`, 
                [`%${keyword}%`] 
            );
            return result.rows;
        } catch (error) {
            console.error('Error searching users:', error);
            throw new Error('Database query failed');
        }
    }

    // Find user by criteria
    static async find(criteria){
        const keys = Object.keys(criteria);
        const conditions = keys.map((key, index) => `${key} = $${index + 1}`).join(' AND ');

        try {
            const result = await db.query(`SELECT id, username, password, email, created_at, updated_at, admin FROM users WHERE ${conditions}`, Object.values(criteria));
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
                RETURNING id, username, email, created_at, updated_at, admin;`,
                [username, email, hashedPassword]
            );

            const user = result.rows[0];
            const { token, expirationTime } = generateToken(user);
            const { refreshToken, refreshTokenExpirationTime } = generateRefreshToken(user);

            return { 
                token, 
                refreshToken, 
                expirationTime, 
                refreshTokenExpirationTime,
                user
            };
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
            const { token, expirationTime } = generateToken(user);
            const { refreshToken, refreshTokenExpirationTime } = generateRefreshToken(user);
            return { 
                token, 
                refreshToken, 
                expirationTime, 
                refreshTokenExpirationTime,
                user: { 
                    id: user.id, 
                    username: user.username, 
                    email: user.email,
                    created_at: user.created_at,
                    updated_at: user.updated_at,
                    admin: user.admin,
                } 
            };
        } catch (error) {
            console.error('Error logging in:', error);
            throw new Error('Login failed');
        }
    }
    
    // Update user
    static async update(userId, updates) {  
        const keys = Object.keys(updates);  

        // Checks that password matches db 
        try {
            const user = await this.find({ id: userId });
            if (!user || !(await bcrypt.compare(updates.currentPassword, user.password))){
                throw new Error('Invalid password');
            }
        } catch (error) {
            throw error;
        }

        const allowedKeys = ['username', 'email', 'password']; 

        // Check if password is being updated and hash it
        if (updates.newPassword) {  
            updates.password = await bcrypt.hash(updates.newPassword, 10);
            delete updates.newPassword;
        } 
        delete updates.currentPassword;

        // Filter updates for new UPDATE clause
        const filteredUpdates = {};
        allowedKeys.forEach(key => {
            if (updates[key]) {
                filteredUpdates[key] = updates[key];
            }
        });
        if (updates.password) {
            filteredUpdates.password = updates.password;
        }

        const setClause = Object.keys(filteredUpdates)
            .map((key, index) => `${key} = $${index + 2}`)
            .join(', ');
    
        try {  
            const result = await db.query(  
                `UPDATE users SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING id, username, email, created_at, updated_at;`,  
                [userId, ...Object.values(filteredUpdates)]  
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
