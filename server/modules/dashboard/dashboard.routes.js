const express = require('express');
const { authenticateToken } = require('../../middlewares/auth');
const dashboardController = require('./dashboard.controller');

const router = express.Router();

router.get('/', authenticateToken, dashboardController.getDashboard);

module.exports = router;
