const express = require('express');
const authController = require('./auth.controller');
const { redirectIfAuthenticated } = require('./../../middlewares/auth');

const router = express.Router();

router.post('/login', redirectIfAuthenticated, authController.login);
router.post('/logout', redirectIfAuthenticated, authController.logout);

module.exports = router;
