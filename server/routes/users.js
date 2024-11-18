const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../utils/db');
const { authenticateToken } = require('../middlewares/auth');
const { authorize } = require('../middlewares/authorize');

const router = express.Router();

// Fetch all users
router.get('/', authenticateToken, authorize([1]), async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT u.id, u.username, u.email, u.role, t.name as troop
            FROM users u
            LEFT JOIN troops t ON u.troop_id = t.id
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Fetch a single user by ID
router.get('/:id', authenticateToken, authorize([1]), async (req, res) => {
    const userId = req.params.id;

    try {
        const result = await pool.query(`
            SELECT u.id, u.username, u.email, u.role, t.name as troop
            FROM users u
            LEFT JOIN troops t ON u.troop_id = t.id
            WHERE u.id = $1
        `, [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// Create a new user
router.post('/', authenticateToken, authorize([1]), async (req, res) => {
    const { username, email, password, role, troop } = req.body;

    if (!password) {
        return res.status(400).json({ error: 'Password is required for new users' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(`
            INSERT INTO users (username, email, password, role, troop_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
        `, [username, email, hashedPassword, role, troop || null]);

        res.status(201).json({ success: true, id: result.rows[0].id });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Update an existing user
router.put('/:id', authenticateToken, authorize([1]), async (req, res) => {
    const userId = req.params.id;
    const { username, email, role, troop, password } = req.body;

    try {
        let query;
        let values;

        if (password) {
            query = `
                UPDATE users
                SET username = $1, email = $2, role = $3, troop_id = $4, password = crypt($5, gen_salt('bf'))
                WHERE id = $6
            `;
            values = [username, email, role, troop || null, password, userId];
        } else {
            query = `
                UPDATE users
                SET username = $1, email = $2, role = $3, troop_id = $4
                WHERE id = $5
            `;
            values = [username, email, role, troop || null, userId];
        }

        await pool.query(query, values);
        res.json({ message: 'User updated successfully' });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// Delete a user
router.delete('/:id', authenticateToken, authorize([1]), async (req, res) => {
    const userId = req.params.id;

    try {
        await pool.query('DELETE FROM users WHERE id = $1', [userId]);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

module.exports = router;
