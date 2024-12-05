const pool = require('../../utils/db');

const troopsService = {
    // Pobierz wszystkie zastępy dla danej drużyny
    async fetchAllTroops(teamId) {
        const result = await pool.query(`
            SELECT 
                t.id AS troop_id,
                t.name AS troop_name,
                t.leader_id,
                u.name AS leader_name,
                u.surname AS leader_surname
            FROM 
                troops t
            LEFT JOIN 
                users u ON t.leader_id = u.id
            WHERE 
                t.team_id = $1
        `, [teamId]);
        return result.rows;
    },

    // Pobierz szczegóły zastępu na podstawie ID
    async fetchTroopById(troopId, teamId) {
        const result = await pool.query(`
            SELECT 
                t.id AS troop_id,
                t.name AS troop_name,
                t.description,
                t.song,
                t.color,
                t.points,
                t.leader_id,
                u.name AS leader_name,
                u.surname AS leader_surname
            FROM 
                troops t
            LEFT JOIN 
                users u ON t.leader_id = u.id
            WHERE 
                t.id = $1 AND t.team_id = $2
        `, [troopId, teamId]);
        return result.rows[0];
    },

    // Dodaj nowy zastęp
    async createTroop({ name, leaderId, teamId }) {
        const result = await pool.query(`
            INSERT INTO troops (name, leader_id, team_id, description, song, color, points)
            VALUES ($1, $2, $3, NULL, NULL, NULL, 0)
            RETURNING id
        `, [name, leaderId, teamId]);
        return result.rows[0].id;
    },

    // Zaktualizuj zastęp
    async updateTroop(troopId, { name, description, song, color }) {
        const result = await pool.query(`
            UPDATE troops
            SET name = $1, description = $2, song = $3, color = $4
            WHERE id = $5
            RETURNING *
        `, [name, description, song, color, troopId]);
        return result.rows[0];
    },

    // Usuń zastęp
    async deleteTroop(troopId) {
        const result = await pool.query(`
            DELETE FROM troops
            WHERE id = $1
            RETURNING *
        `, [troopId]);
        return result.rowCount > 0;
    }
};

module.exports = troopsService;
