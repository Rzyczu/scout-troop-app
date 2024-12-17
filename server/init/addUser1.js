const fs = require('fs');
const path = require('path');
const pool = require('../utils/db');

const addUser1 = async () => {
    try {
        const sqlPath = path.join(__dirname, './sql/us_init.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            await client.query(sql);
            await client.query('COMMIT');
            console.log('2 new users added successfully!');
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('Error adding users:', err.message);
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Failed to add users:', err.message);
    }
};

module.exports = addUser1;
