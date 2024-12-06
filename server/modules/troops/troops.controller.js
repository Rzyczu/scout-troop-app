const { sendError, errorMessages } = require('../../utils/errorManager');

const troopsController = {
    async fetchAllTroops(req, res) {
        try {
            const teamId = req.user.team_id;
            console.log(teamId);
            const troops = await troopsService.fetchAllTroops(teamId);
            res.status(200).json({ success: true, data: troops });
        } catch (error) {
            sendError(res, errorMessages.troops.fetchAll, 500);
        }
    },

    async fetchTroopById(req, res) {
        try {
            const teamId = req.user.team_id;
            const troop = await troopsService.fetchTroopById(req.params.id, teamId);
            if (!troop) {
                return sendError(res, errorMessages.troops.fetchSingle.notFound, 404);
            }
            res.status(200).json({ success: true, data: troop });
        } catch (error) {
            sendError(res, errorMessages.troops.fetchSingle.default, 500);
        }
    },

    async createTroop(req, res) {
        try {
            const { name, leaderId } = req.body;
            const teamId = req.user.team_id;

            if (!name || !leaderId) {
                return sendError(res, errorMessages.troops.create.validation, 400);
            }

            const troopId = await troopsService.createTroop({ name, leaderId, teamId });
            res.status(201).json({ success: true, message: 'Troop created successfully.', data: { id: troopId } });
        } catch (error) {
            sendError(res, errorMessages.troops.create.default, 500);
        }
    },

    async updateTroop(req, res) {
        try {
            const troopId = req.params.id;
            const { name, description, song, color } = req.body;

            const updatedTroop = await troopsService.updateTroop(troopId, { name, description, song, color });
            res.status(200).json({ success: true, message: 'Troop updated successfully.', data: updatedTroop });
        } catch (error) {
            sendError(res, errorMessages.troops.update.default, 500);
        }
    },

    async deleteTroop(req, res) {
        try {
            const troopId = req.params.id;

            const deleted = await troopsService.deleteTroop(troopId);
            if (!deleted) {
                return sendError(res, errorMessages.troops.delete.notFound, 404);
            }

            res.status(200).json({ success: true, message: 'Troop deleted successfully.' });
        } catch (error) {
            sendError(res, errorMessages.troops.delete.default, 500);
        }
    },
};

module.exports = troopsController;
