const pool = require('../../utils/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../config');
const { throwError, errorMessages } = require('../../utils/errorManager');

const authService = {
    async login(email, password) {

        if (!email || !password) {
            throwError(errorMessages.login.missingCredentials);
        }

        const result = await pool.query(
            `
            SELECT 
                ul.user_id AS id,
                ul.password,
                us.function,
                t.gender,
                t.id AS team_id
            FROM 
                users_login ul
            JOIN 
                users u ON ul.user_id = u.id
            JOIN 
                users_scout us ON u.id = us.user_id
            JOIN 
                teams t ON u.team_id = t.id
            WHERE 
                ul.mail = $1;

            `,
            [email]
        );

        const user = result.rows[0];

        console.log(user)
        if (!user) {
            throwError(errorMessages.login.invalidCredentials);
        }

        if (!user.password) {
            throwError(errorMessages.login.passwordNotFound);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throwError(errorMessages.login.invalidCredentials);
        }

        const token = jwt.sign(
            { user_id: user.id, function: user.function, team_id: user.team_id },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return { token, gender: user.gender };
    },


    async logout(res) {
        res.clearCookie('token');
        return { success: true, message: 'Logged out successfully' };
    },
};

module.exports = authService;
