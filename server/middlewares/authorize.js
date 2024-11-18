const authorize = (roles) => (req, res, next) => {
    const userRole = parseInt(req.user.role, 10); // Convert role to integer if stored as number
    if (!roles.includes(userRole)) {
        return res.status(403).json({ error: 'Access denied' });
    }
    next();
};

module.exports = { authorize };
