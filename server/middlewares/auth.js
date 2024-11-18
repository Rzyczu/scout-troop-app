const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token || (req.headers.authorization?.split(' ')[1] || null);
    if (!token) {
        return res.status(401).json({ error: 'Access denied, token missing or invalid format' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

module.exports = { authenticateToken };
