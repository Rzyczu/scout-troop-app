const express = require('express');
const { authenticateToken } = require('../middlewares/auth');
const { UserRoles, mapEnum } = require('../utils/enums');

const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
    try {
        const dashboardData = {
            message: `Witaj ${mapEnum(UserRoles, req.user.role).full}!`,
            troopId: req.user.troopId || null, // Example field
        };
        res.json(dashboardData);
    } catch (err) {
        console.error('Error fetching dashboard data:', err);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});

module.exports = router;
