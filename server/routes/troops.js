const express = require('express');
const pool = require('../utils/db');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name FROM troops');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching troops:', err);
        res.status(500).json({ error: 'Failed to fetch troops' });
    }
});

module.exports = router;
