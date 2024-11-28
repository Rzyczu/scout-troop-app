const authService = require('./auth.service');
const errorMessages = require('../../utils/errorMessages');

const authController = {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const { token, function: userFunction } = await authService.login(email, password);
            res.cookie('token', token, { httpOnly: true, secure: true });
            res.status(200).json({ success: true, function: userFunction });
        } catch (error) {
            if (error.code) {
                res.json({ success: false, error: error.default, code: error.code });
            } else {
                res.json({ success: false, ...errorMessages.databaseError });
            }
        }
    },

    async logout(req, res) {
        try {
            const response = await loginService.logout(res);
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || errorMessages.general.somethingWentWrong,
            });
        }
    },
};

module.exports = authController;
