require('dotenv').config();
const { Pool } = require('pg');

const dbConfig = {
    user: process.env.DB_USER || 'postgres.tyqwqeqmzxpzuucjywjr',
    host: process.env.DB_HOST || 'aws-0-eu-central-1.pooler.supabase.com',
    database: process.env.DB_NAME || 'postgres',
    password: process.env.DB_PASSWORD || 'qZQbVq*GC.27XQU',
    port: process.env.DB_PORT || 6543,
};

const pool = new Pool(dbConfig);

pool.on('connect', () => {
    console.log('Database connected successfully.');
});

pool.on('error', (err) => {
    console.error('Unexpected database error:', err);
    process.exit(-1);
});

module.exports = pool;
