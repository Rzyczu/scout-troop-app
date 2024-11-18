const express = require('express');
const { UserRoles, ScoutFunctions, ScoutRanks, InstructorRanks } = require('../utils/enums');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

router.get('/roles', authenticateToken, (req, res) => {
    try {
        const roles = Object.entries(UserRoles).map(([id, name]) => ({ id, name }));
        res.json(roles);
    } catch (err) {
        console.error('Error fetching roles:', err);
        res.status(500).json({ error: 'Failed to fetch roles' });
    }
});

router.get('/scout-functions', authenticateToken, (req, res) => {
    try {
        const scoutFunctions = Object.entries(ScoutFunctions).map(([id, name]) => ({ id: parseInt(id), name }));
        res.json(scoutFunctions);
    } catch (err) {
        console.error('Error fetching scout functions:', err);
        res.status(500).json({ error: 'Failed to fetch scout functions' });
    }
});

router.get('/scout-ranks', authenticateToken, (req, res) => {
    try {
        const scoutRanks = Object.entries(ScoutRanks).map(([id, { full }]) => ({ id: parseInt(id), name: full }));
        res.json(scoutRanks);
    } catch (err) {
        console.error('Error fetching scout ranks:', err);
        res.status(500).json({ error: 'Failed to fetch scout ranks' });
    }
});

router.get('/instructor-ranks', authenticateToken, (req, res) => {
    try {
        const instructorRanks = Object.entries(InstructorRanks).map(([id, { full }]) => ({ id: parseInt(id), name: full }));
        res.json(instructorRanks);
    } catch (err) {
        console.error('Error fetching instructor ranks:', err);
        res.status(500).json({ error: 'Failed to fetch instructor ranks' });
    }
});

module.exports = router;
