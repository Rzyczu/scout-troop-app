const pool = require('../../utils/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../config');
const { throwError, errorMessages } = require('../../utils/errorManager');

const authService = {
    async login(email, password) {
        console.log(email, password);

        if (!email || !password) {
            throwError(errorMessages.login.missingCredentials);
            console.log('errorMessages.login.missingCredentials');

        }

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
        console.log('SELECT');


        const user = result.rows[0];
        console.log(user);

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
            { id: user.id, function: user.function },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return { token, function: user.function };
    },


    async logout(res) {
        res.clearCookie('token');
        return { success: true, message: 'Logged out successfully' };
    },
};

module.exports = authService;
