const fs = require('fs');
const path = require('path');
const pool = require('../utils/db');
const bcrypt = require('bcryptjs');

const addAdminUser = async () => {
    try {
        const plainPassword = 'zaq1@WSX';
        const hashedPassword = await bcrypt.hash(plainPassword, 10);
        const sqlPath = path.join(__dirname, './sql/admin_init.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        const client = await pool.connect();
        try {
            const insertTeamSQL = `
            DO $$ 
BEGIN 
  -- Check if the team already exists
  IF NOT EXISTS (SELECT 1 FROM teams WHERE name = 'exampleTeam1' AND gender = 0) THEN
    -- Insert the team only if it does not exist
    INSERT INTO teams (name, gender)
    VALUES ('exampleTeam1', 0);
  END IF;
END $$;

        `;

            await client.query(insertTeamSQL);
            await client.query('BEGIN');
            const finalSQL = sql.replace('PASSWORD_', hashedPassword);
            await client.query(finalSQL);
            await client.query('COMMIT');
            console.log('Admin user added successfully!');
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

module.exports = addAdminUser;
