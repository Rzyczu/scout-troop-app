const bcrypt = require('bcryptjs');
const pool = require('../utils/db');

const initializeAdminUser = async () => {
    const admin = {
        username: 'admin',
        password: await bcrypt.hash('admin', 10),
        email: 'admin@admin.adm',
        role: 1, // Drużynowy
    };

    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [admin.username]);
        if (result.rows.length === 0) {
            await pool.query(
                'INSERT INTO users (username, password, email, role) VALUES ($1, $2, $3, $4)',
                [admin.username, admin.password, admin.email, admin.role]
            );
            console.log('Admin user initialized');
        } else {
            console.log('Admin user already exists.');
        }
    } catch (err) {
        console.error('Error initializing admin user:', err.message);
    }
};

module.exports = initializeAdminUser;
