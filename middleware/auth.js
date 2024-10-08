const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const authRequired = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader ? authHeader.split(' ')[1] : null;

        if (!token){
            return res.status(401).json({ message: 'Authentication required' });
        }

        jwt.verify(token, JWT_SECRET, (error, user) => {
            if (error) {
              return res.status(403).json({ message: 'Invalid token' }); 
            }
            req.user = user;
            next();
        });
    } catch (error) {
        console.error('Error in middleware:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    authRequired
};