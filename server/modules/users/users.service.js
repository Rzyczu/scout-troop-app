const pool = require('../../utils/db');

const fetchUsers = async (teamId) => {
    const result = await pool.query(`
        SELECT 
            u.id AS user_id,
            u.name,
            u.surname,
            ul.mail AS email,
            us.function AS function,
            t.name AS troop
        FROM 
            users u
        INNER JOIN 
            users_login ul ON u.id = ul.user_id
        LEFT JOIN 
            users_scout us ON u.id = us.user_id
        LEFT JOIN 
            troops t ON us.troop_id = t.id
        WHERE 
            u.team_id = $1
    `, [teamId]);
    return result.rows;
};

const fetchAllUsers = async (teamId) => {
    const result = await pool.query(`
        SELECT 
            u.id AS user_id,
            u.name,
            u.surname
        FROM 
            users u
        WHERE 
            u.team_id = $1
    `, [teamId]);

    console.log('select');
    console.log(result.rows);
    return result.rows;
};

const fetchUserById = async (userId, teamId) => {
    const result = await pool.query(`
        SELECT 
            u.id AS user_id,
            u.name,
            u.surname,
            ul.mail AS email,
            us.function AS function,
            t.name AS troop
        FROM 
            users u
        INNER JOIN 
            users_login ul ON u.id = ul.user_id
        LEFT JOIN 
            users_scout us ON u.id = us.user_id
        LEFT JOIN 
            troops t ON us.troop_id = t.id
        WHERE 
            ul.user_id = $1 AND u.team_id = $2
    `, [userId, teamId]);
    return result.rows[0];
};

const createUser = async (userId, email, hashedPassword) => {
    await pool.query(`
        INSERT INTO users_login (user_id, mail, password)
        VALUES ($1, $2, $3)
    `, [userId, email, hashedPassword]);
};

const updateUser = async (userId, email, hashedPassword = null) => {
    const query = hashedPassword
        ? `
            UPDATE users_login
            SET mail = $1, password = crypt($2, gen_salt('bf'))
            WHERE user_id = $3
        `
        : `
            UPDATE users_login
            SET mail = $1
            WHERE user_id = $2
        `;

    const values = hashedPassword ? [email, hashedPassword, userId] : [email, userId];
    await pool.query(query, values);
};

const deleteUser = async (userId) => {
    const result = await pool.query('DELETE FROM users_login WHERE user_id = $1 RETURNING *', [userId]);
    return result.rowCount;
};

module.exports = { fetchUsers, fetchAllUsers, fetchUserById, createUser, updateUser, deleteUser };
