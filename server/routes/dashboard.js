const express = require('express');
const { authenticateToken } = require('../middlewares/auth');
const { ScoutFunctions, mapEnum } = require('../utils/enums');
const pool = require('../utils/db'); // Połączenie z bazą danych

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
    try {
        // Pobranie szczegółowych informacji o użytkowniku z bazy danych
        const result = await pool.query(
            `
            SELECT 
                u.name,
                u.surname,
                us.function,
                us.troop_id,
                t.name AS troop_name
            FROM 
                users u
            INNER JOIN 
                users_scout us
            ON 
                u.id = us.user_id
            LEFT JOIN 
                troops t
            ON 
                us.troop_id = t.id
            WHERE 
                u.id = $1
            `,
            [req.user.id]
        );

        const userDetails = result.rows[0];

        if (!userDetails) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Tworzenie danych dashboardu
        const dashboardData = {
            message: `Witaj ${userDetails.name} ${userDetails.surname}, jesteś ${mapEnum(
                ScoutFunctions,
                userDetails.function
            )}!`,
            troop: userDetails.troop_id
                ? { id: userDetails.troop_id, name: userDetails.troop_name }
                : null,
        };

        res.json(dashboardData);
    } catch (err) {
        console.error('Error fetching dashboard data:', err.message);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});

module.exports = router;
