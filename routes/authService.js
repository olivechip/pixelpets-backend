const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (user) => {
    const expiresIn = '1h';
    const expirationTime = Math.floor(Date.now() / 1000) + (60 * 60);
    return {
        token: jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn }),
        expirationTime
    };
};

const generateRefreshToken = (user) => {
    const expiresIn = '7d';
    const refreshTokenExpirationTime = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60);
    return {
        refreshToken: jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn }),
        refreshTokenExpirationTime
    };
};

module.exports = {
    generateToken,
    generateRefreshToken
};