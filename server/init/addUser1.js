const fs = require('fs');
const path = require('path');
const pool = require('../utils/db');
const bcrypt = require('bcryptjs');

const addUser1 = async () => {
    try {
        const sqlPath = path.join(__dirname, './sql/admin_init copy.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            await client.query(sql);
            await client.query('COMMIT');
            console.log('user added successfully!');
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('Error adding admin user:', err.message);
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Failed to add admin user:', err.message);
    }
};

module.exports = addUser1;
