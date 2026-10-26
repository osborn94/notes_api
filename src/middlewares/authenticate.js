const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

const authenticate = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        throw new AppError('Authentication failed. Token not provided.', 401);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.userId;
        next();

    } catch (error) {
        throw new AppError('Authentication failed. Invalid or expired token.', 401);
    }
};

module.exports = authenticate;

