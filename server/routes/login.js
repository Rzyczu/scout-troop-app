const express = require('express');
const loginService = require('../services/loginService');
const errorMessages = require('../utils/errorMessages');

const router = express.Router();

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        const { token, function: userFunction } = await loginService.login(email, password);

        // Ustawianie ciasteczka z tokenem
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
        });

        res.json({ success: true, function: userFunction });
    } catch (err) {
        if (err.code) {
            res.json({ success: false, error: err.default, code: err.code });
        } else {
            res.json({ success: false, ...errorMessages.databaseError });
        }
    }
});

router.post('/logout', (req, res) => {
    const logoutResponse = loginService.logout(res);
    res.json(logoutResponse);
});

module.exports = router;
