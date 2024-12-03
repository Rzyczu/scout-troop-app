const dashboardService = require('./dashboard.service');

const dashboardController = {
    async getDashboard(req, res) {
        try {
            const dashboardData = await dashboardService.getDashboardData(req.user.id);
            res.json(dashboardData);
        } catch (err) {
            console.error('Error fetching dashboard data:', err.message);
            res.status(err.message === 'User not found' ? 404 : 500).json({ error: err.message });
        }
    },
};

module.exports = dashboardController;
