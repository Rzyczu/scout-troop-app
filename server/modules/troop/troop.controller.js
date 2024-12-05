const troopsService = require('./troops.service');
const { sendError, errorMessages } = require('../../utils/errorManager');

const troopController = {
    async fetchTroopDetails(req, res) {
        try {
            const { team_id: teamId } = req.user;
            const troop = await troopsService.fetchTroopById(req.params.id, teamId);
            if (!troop) {
                return sendError(res, errorMessages.troops.fetchSingle.notFound, 404);
            }
            res.status(200).json({ success: true, data: troop });
        } catch (error) {
            sendError(res, errorMessages.troops.fetchSingle.default, 500);
        }
    },

    async updateTroopDetails(req, res) {
        try {
            const troopId = req.params.id;
            const { name, description, song, color } = req.body;

            const updatedTroop = await troopsService.updateTroop(troopId, { name, description, song, color });
            if (!updatedTroop) {
                return sendError(res, errorMessages.troops.update.default, 404);
            }

            res.status(200).json({ success: true, message: 'Troop updated successfully.', data: updatedTroop });
        } catch (error) {
            sendError(res, errorMessages.troops.update.default, 500);
        }
    },

    async fetchTroopUsers(req, res) {
        try {
            const teamId = req.user.team_id;
            const users = await troopsService.fetchTroopUsers(req.params.id, teamId);
            res.status(200).json({ success: true, data: users });
        } catch (error) {
            sendError(res, errorMessages.troop.users.fetchAll, 500);
        }
    },

    async addUserToTroop(req, res) {
        try {
            const teamId = req.user.team_id;
            const { userId } = req.body;
            const troopId = req.params.id;

            if (!userId) {
                return sendError(res, errorMessages.troop.users.add.validation, 400);
            }

            const addedUser = await troopsService.addUserToTroop(userId, troopId, teamId);
            res.status(201).json({ success: true, message: 'User added to troop successfully.', data: addedUser });
        } catch (error) {
            sendError(res, errorMessages.troop.users.add.default, 500);
        }
    },

    async removeUserFromTroop(req, res) {
        try {
            const { userId } = req.body;

            if (!userId) {
                return sendError(res, errorMessages.troop.users.remove.notFound, 404);
            }

            await troopsService.removeUserFromTroop(userId);
            res.status(200).json({ success: true, message: 'User removed from troop successfully.' });
        } catch (error) {
            sendError(res, errorMessages.troop.users.remove.default, 500);
        }
    },
};

module.exports = troopController;
