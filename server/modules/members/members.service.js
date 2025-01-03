const pool = require('../../utils/db');

const fetchAllMembers = async (teamId) => {
    const result = await pool.query(`
        SELECT 
            u.id AS id,
            u.name,
            u.surname,
            u.date_birth,
            uc.phone_number,
            uc.mother_phone_number,
            uc.father_phone_number,
            uc.parent_email_1,
            uc.parent_email_2,
            us.function,
            us.open_rank,
            us.achieved_rank,
            us.instructor_rank,
            us.troop_id,
            t.name AS troop_name
        FROM 
            users u
        LEFT JOIN 
            users_contact uc ON u.id = uc.user_id
        LEFT JOIN 
            users_scout us ON u.id = us.user_id
        LEFT JOIN 
            troops t ON us.troop_id = t.id
        WHERE 
            u.team_id = $1
    `, [teamId]);
    return result.rows;
};
const fetchMemberById = async (id, teamId) => {
    const result = await pool.query(`
        SELECT 
            u.id AS id,
            u.name,
            u.surname,
            u.date_birth,
            uc.phone_number,
            uc.mother_phone_number,
            uc.father_phone_number,
            uc.parent_email_1,
            uc.parent_email_2,
            us.function,
            us.open_rank,
            us.achieved_rank,
            us.instructor_rank,
            us.troop_id
        FROM 
            users u
        LEFT JOIN 
            users_contact uc ON u.id = uc.user_id
        LEFT JOIN 
            users_scout us ON u.id = us.user_id
        WHERE 
            u.id = $1 AND u.team_id = $2
    `, [id, teamId]);
    return result.rows[0];
};

const createMember = async (user, contact, scout) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const userResult = await client.query(`
            INSERT INTO users (name, surname, date_birth, team_id) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id
        `, [user.name, user.surname, user.date_birth, user.team_id]);
        const userId = userResult.rows[0].id;

        await client.query(`
            INSERT INTO users_contact (user_id, phone_number, mother_phone_number, father_phone_number, parent_email_1, parent_email_2)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [userId, contact.phone_number, contact.mother_phone_number, contact.father_phone_number, contact.parent_email_1, contact.parent_email_2]);

        await client.query(`
            INSERT INTO users_scout (user_id, function, open_rank, achieved_rank, instructor_rank, troop_id)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [userId, scout.function, scout.open_rank, scout.achieved_rank, scout.instructor_rank, scout.troop_id]);

        await client.query('COMMIT');
        return userId;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

const updateMember = async (id, user, contact, scout) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        await client.query(`
            UPDATE users 
            SET name = $1, surname = $2, date_birth = $3
            WHERE id = $4
        `, [user.name, user.surname, user.date_birth, id]);

        await client.query(`
            UPDATE users_contact 
            SET phone_number = $1, mother_phone_number = $2, father_phone_number = $3, parent_email_1 = $4, parent_email_2 = $5
            WHERE user_id = $6
        `, [contact.phone_number, contact.mother_phone_number, contact.father_phone_number, contact.parent_email_1, contact.parent_email_2, id]);

        await client.query(`
            UPDATE users_scout 
            SET function = $1, open_rank = $2, achieved_rank = $3, instructor_rank = $4, troop_id = $5
            WHERE user_id = $6
        `, [scout.function, scout.open_rank, scout.achieved_rank, scout.instructor_rank, scout.troop_id, id]);

        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

const deleteMember = async (id) => {
    const result = await pool.query(`
        DELETE FROM users WHERE id = $1 RETURNING *
    `, [id]);
    return result.rowCount > 0;
};

const checkIfUserIsTroopLeader = async (userId) => {
    const result = await pool.query(`
        SELECT id FROM troops WHERE leader_id = $1
    `, [userId]);
    return result.rowCount > 0;
};

module.exports = { checkIfUserIsTroopLeader, fetchAllMembers, fetchMemberById, createMember, updateMember, deleteMember };
