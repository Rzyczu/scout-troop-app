const pool = require('../../utils/db');

const troopsService = {
    // Pobierz wszystkie zastępy dla danej drużyny
    async fetchAllTroops(teamId) {
        const result = await pool.query(`
            SELECT 
                t.id AS id,
                t.name AS name,
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

        const formattedResults = result.rows.map(row => ({
            id: row.id,
            name: row.name,
            leader: row.leader_id ? {
                id: row.leader_id,
                name: row.leader_name,
                surname: row.leader_surname
            } : null
        }));

        return formattedResults;
    },

    // Pobierz szczegóły zastępu na podstawie ID
    async fetchTroopById(troopId, teamId) {
        const result = await pool.query(`
            SELECT 
                t.id AS id,
                t.name AS name,
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

        if (result.rows.length === 0) {
            return null;
        }

        const row = result.rows[0];

        const formattedResult = {
            id: row.id,
            name: row.name,
            description: row.description || '',
            song: row.song || '',
            color: row.color || '',
            points: row.points || 0,
            leader: row.leader_id ? {
                id: row.leader_id,
                name: row.leader_name,
                surname: row.leader_surname
            } : null
        };

        return formattedResult;
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

    // Zaktualizuj zast-ęp
    async updateTroop(troopId, name, leaderId) {
        await pool.query(
            `UPDATE users_scout 
             SET troop_id = NULL 
             WHERE user_id = $1`,
            [leaderId]
        );

        const result = await pool.query(
            `UPDATE troops
             SET name = $2, leader_id = $3
             WHERE id = $1
             RETURNING *`,
            [troopId, name, leaderId]
        );

        // Przypisz troop_id do lidera
        await pool.query(
            `UPDATE users_scout 
             SET troop_id = $1 
             WHERE user_id = $2`,
            [troopId, leaderId]
        );

        return result.rows[0];
    },

    // Usuń zastęp
    async deleteTroop(troopId) {
        try {
            console.log('Starting troop deletion for troopId:', troopId);

            const resetLeader = await pool.query(`
                UPDATE troops
                SET leader_id = NULL
                WHERE id = $1
            `, [troopId]);
            console.log('Reset leader_id for troop:', resetLeader.rowCount);

            const result = await pool.query(`
                DELETE FROM troops
                WHERE id = $1
                RETURNING *
            `, [troopId]);

            console.log('Troop deleted successfully:', result.rowCount > 0);
            return result.rowCount > 0;
        } catch (error) {
            console.error('Error occurred while deleting troop:', error);
            throw new Error('Failed to delete troop');
        }
    },

    // Sprawdź, czy leader jest już liderem innego zastępu
    async checkIfLeaderExists(leaderId) {
        const result = await pool.query(`
        SELECT id 
        FROM troops 
        WHERE leader_id = $1
    `, [leaderId]);
        return result.rowCount > 0;
    },

    // Sprawdź, czy leader jest drużynowym
    async checkIfTeamLeader(leaderId) {
        const result = await pool.query(`
        SELECT function 
        FROM users_scout 
        WHERE user_id = $1 AND function = 4
    `, [leaderId]);
        return result.rowCount > 0;
    },

    // Przypisz lidera do zastępu (ustaw troop_id w users_scout)
    async assignLeaderToTroop(leaderId, troopId) {
        await pool.query(`
            UPDATE users_scout 
            SET troop_id = NULL 
            WHERE user_id = $1
        `, [leaderId]);

        await pool.query(`
            UPDATE users_scout 
            SET troop_id = $1 
            WHERE user_id = $2
        `, [troopId, leaderId]);
    },

    async setLeaderFunction(userId, functionId) {
        await pool.query(`
            UPDATE users_scout 
            SET function = $1 
            WHERE user_id = $2
        `, [functionId, userId]);
    }
};

module.exports = troopsService;
