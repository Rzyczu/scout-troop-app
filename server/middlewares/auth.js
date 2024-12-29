const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

const redirectIfNotAuthenticated = (req, res, next) => {
    const token = req.cookies.token || (req.headers.authorization?.split(' ')[1] || null);

    if (!token) {
        return res.redirect('/auth');
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.redirect('/auth');
        }
        req.user = user;
        next();
    });
};

const redirectIfAuthenticated = (req, res, next) => {
    const token = req.cookies.token || (req.headers.authorization?.split(' ')[1] || null);

    if (token) {
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (!err) {
                console.log('Zalogowany użytkownik:', user);
                return res.redirect('/dashboard');
            }
            next();
        });
    } else {
        console.log('Brak tokena');
        next();
    }
};

const authorize = (roles) => (req, res, next) => {
    const userRole = parseInt(req.user.function, 10);
    if (!roles.includes(userRole)) {
        return res.status(403).json({ error: 'Access denied' });
    }
    next();
};

module.exports = { redirectIfNotAuthenticated, redirectIfAuthenticated, authorize };
