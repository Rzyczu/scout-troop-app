const authService = require('./auth.service');
const { sendError } = require('../../utils/errorManager');

const authController = {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            console.log(email, password);
            const { token, function: userFunction } = await authService.login(email, password);

            res.cookie('token', token, { httpOnly: true, secure: true });
            res.status(200).json({ success: true, function: userFunction });
        } catch (error) {
            sendError(res, error, error.code === 'LOGIN_INVALID_CREDENTIALS' ? 401 : 400);
        }
    },

    async logout(req, res) {
        try {
            res.clearCookie('token');
            res.status(200).json({ success: true, message: 'Logged out successfully' });
        } catch (error) {
            sendError(res, error);
        }
    },
};

module.exports = authController;
