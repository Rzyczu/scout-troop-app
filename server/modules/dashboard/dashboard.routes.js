const express = require('express');
const { redirectIfNotAuthenticated } = require('./../../middlewares/auth');
const dashboardController = require('./dashboard.controller');

const router = express.Router();

router.get('/', redirectIfNotAuthenticated, dashboardController.getDashboard);

module.exports = router;
