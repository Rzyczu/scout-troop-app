const pool = require('../utils/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const errorMessages = require('../utils/errorMessages');

const loginService = {
    async login(email, password) {
        if (!email || !password) {
            throw { ...errorMessages.login.missingCredentials };
        }

        // Pobieranie użytkownika z bazy danych
        const result = await pool.query(
            `
            SELECT 
                ul.user_id AS id,
                ul.password,
                us.function
            FROM 
                users_login ul
            INNER JOIN 
                users_scout us
            ON 
                ul.user_id = us.user_id
            WHERE 
                ul.mail = $1
            `,
            [email]
        );

        const user = result.rows[0];
        if (!user) {
            throw { ...errorMessages.login.invalidCredentials };
        }

        if (!user.password) {
            throw { ...errorMessages.login.passwordNotFound };
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw { ...errorMessages.login.invalidCredentials };
        }

        const token = jwt.sign({ id: user.id, function: user.function }, JWT_SECRET, { expiresIn: '1h' });

        return {
            token,
            function: user.function,
        };
    },

    async logout(res) {
        res.clearCookie('token');
        return { success: true, message: 'Logged out successfully' };
    },
};

module.exports = loginService;
