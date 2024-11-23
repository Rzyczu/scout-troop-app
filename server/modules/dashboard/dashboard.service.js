const pool = require('../../utils/db');
const { ScoutFunctions, mapEnum } = require('../../utils/enums');

const dashboardService = {
    async getDashboardData(userId) {
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
            [userId]
        );

        const userDetails = result.rows[0];

        if (!userDetails) {
            throw new Error('User not found');
        }

        // Tworzenie danych dashboardu
        return {
            message: `Witaj ${userDetails.name} ${userDetails.surname}, jesteś ${mapEnum(
                ScoutFunctions,
                userDetails.function
            )}!`,
            troop: userDetails.troop_id
                ? { id: userDetails.troop_id, name: userDetails.troop_name }
                : null,
        };
    },
};

module.exports = dashboardService;
