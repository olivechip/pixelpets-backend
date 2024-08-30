const db = require("../db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


/** Collection of related methods for users. */

class User {
    
    static async findAll(){
        try {
            const result = db.query(`SELECT username, email, created_at, updated_at FROM users;`);
            return result;
        } catch (error) {
            console.error('Error finding users:', error);
            throw new Error('Database query failed');
        }
    }
    static async find(criteria){
        const keys = Object.keys(criteria);
        const conditions = keys.map((key, index) => `${key} = $${index + 1}`).join(' AND ');

        try {
            const result = await db.query(`SELECT * FROM users WHERE ${conditions}`, Object.values(criteria));
            return result.rows[0] || null;
          } catch (error) {
            console.error('Error finding user:', error);
            throw new Error('Database query failed');
          }
    }

    static async register({ username, email, password }) {
        const existingUser = await this.find({ email });
        if (existingUser) throw new Error('User already exists');
    
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
    
      static async login({ email, password }) {
        const user = await this.find({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) throw new Error('Invalid credentials');
        try {
          const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
          return { token, user: { id: user.id, username: user.username, email: user.email } };
        } catch (error) {
          console.error('Error logging in:', error);
          throw new Error('Login failed');
        }
      }
    
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
    
      static async delete(userId) {
        try {
          const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id;', [userId]);
          return result.rowCount > 0;
        } catch (error) {
          console.error('Error deleting user:', error);
          throw new Error('Deletion failed');
        }
      }
}


module.exports = User;
