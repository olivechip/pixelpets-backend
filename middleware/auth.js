const jwt = require('jsonwebtoken');

const authRequired = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token){
        return res.status(401).json({ error: 'Unauthorized - No token provided' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Error verifying JWT:', error);
        return res.status(401).json({ error: 'Unauthorized - Invalid token' })
    }
}

module.exports = authRequired;