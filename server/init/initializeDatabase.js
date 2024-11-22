const fs = require('fs');
const path = require('path');
const pool = require('../utils/db'); // Połączenie do bazy danych

const initializeDatabase = async () => {
    try {

        // Ścieżki do plików SQL
        const schemaPath = path.join(__dirname, './sql/db_init.sql');
        const validateLeaderPath = path.join(__dirname, './sql/validate_leader.sql');
        const validateFunctionPath = path.join(__dirname, './sql/validate_function_limit.sql');
        const updateLeaderPath = path.join(__dirname, './sql/update_troop_leader.sql');

        // Wczytanie plików SQL
        const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
        const validateLeaderSQL = fs.readFileSync(validateLeaderPath, 'utf8');
        const validateFunctionSQL = fs.readFileSync(validateFunctionPath, 'utf8');
        const updateLeaderSQL = fs.readFileSync(updateLeaderPath, 'utf8');

        // Rozpoczęcie transakcji
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            await client.query(schemaSQL); // Tworzenie tabel
            await client.query(validateLeaderSQL); // Wyzwalacz dla lidera
            await client.query(validateFunctionSQL); // Wyzwalacz dla funkcji
            await client.query(updateLeaderSQL); // Wyzwalacz dla automatycznej aktualizacji lidera
            await client.query('COMMIT');
            console.log('Database initialized successfully!');
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('Error during database initialization:', err.message);
            throw err;
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Failed to initialize database:', err.message);
    }
};


module.exports = initializeDatabase;
