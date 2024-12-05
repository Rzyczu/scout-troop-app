const pool = require('../../utils/db');

const fetchTroopById = async (id, teamId) => {
    const result = await pool.query(`
        SELECT 
            id, name, leader_id, description, song, color, points 
        FROM 
            troops 
        WHERE 
            id = $1 AND team_id = $2
    `, [id, teamId]);
    return result.rows[0];
};

const updateTroop = async (id, { name, description, song, color }) => {
    const result = await pool.query(`
        UPDATE troops 
        SET name = $1, description = $2, song = $3, color = $4
        WHERE id = $5
        RETURNING *
    `, [name, description, song, color, id]);
    return result.rows[0];
};

const fetchTroopUsers = async (troopId, teamId) => {
    const result = await pool.query(`
        SELECT 
            u.id AS user_id,
            u.name,
            u.surname,
            ul.mail AS email,
            us.function AS scout_function
        FROM 
            users u
        INNER JOIN 
            users_login ul ON u.id = ul.user_id
        INNER JOIN 
            users_scout us ON u.id = us.user_id
        WHERE 
            us.troop_id = $1 AND u.team_id = $2
    `, [troopId, teamId]);
    return result.rows;
};

const addUserToTroop = async (userId, troopId, teamId) => {
    const result = await pool.query(`
        UPDATE users_scout 
        SET troop_id = $1 
        WHERE user_id = $2 
        AND user_id IN (SELECT id FROM users WHERE team_id = $3)
        RETURNING user_id, troop_id
    `, [troopId, userId, teamId]);
    return result.rows[0];
};

const removeUserFromTroop = async (userId) => {
    const result = await pool.query(`
        UPDATE users_scout 
        SET troop_id = NULL 
        WHERE user_id = $1
        RETURNING user_id
    `, [userId]);
    return result.rows[0];
};

module.exports = { fetchTroopById, updateTroop, fetchTroopUsers, addUserToTroop, removeUserFromTroop };