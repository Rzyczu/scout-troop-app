const troopsService = require('./troops.service');
const { sendError, errorMessages } = require('../../utils/errorManager');

const troopsController = {
    async fetchAllTroops(req, res) {
        try {
            const teamId = req.user.team_id;
            const troops = await troopsService.fetchAllTroops(teamId);
            res.status(200).json({ success: true, data: troops });
        } catch (error) {
            sendError(res, errorMessages.troops.fetchAll.default, 500);
        }
    },

    async fetchTroopById(req, res) {
        try {
            const teamId = req.user.team_id;
            const troop = await troopsService.fetchTroopById(req.params.id, teamId);
            if (!troop) {
                return sendError(res, errorMessages.troop.fetchSingle.notFound, 404);
            }
            res.status(200).json({ success: true, data: troop });
        } catch (error) {
            sendError(res, errorMessages.troop.fetchSingle.default, 500);
        }
    },

    async createTroop(req, res) {
        try {
            const { name, leaderId } = req.body;
            const teamId = req.user.team_id;

            if (!name || !leaderId) {
                return sendError(res, errorMessages.troops.create.validation, 400);
            }

            const existingLeader = await troopsService.checkIfLeaderExists(leaderId);
            if (existingLeader) {
                return sendError(res, errorMessages.troops.create.leaderAlreadyAssigned, 400);
            }

            const isTeamLeader = await troopsService.checkIfTeamLeader(leaderId);
            if (isTeamLeader) {
                return sendError(res, errorMessages.troops.create.leaderIsTeamLeader, 400);
            }

            const troopId = await troopsService.createTroop({ name, leaderId, teamId });

            await troopsService.setLeaderFunction(leaderId, 2);
            await troopsService.assignLeaderToTroop(leaderId, troopId);

            res.status(201).json({ success: true, message: 'Troop created successfully.', data: { id: troopId } });
        } catch (error) {
            sendError(res, errorMessages.troops.create.default, 500);
        }
    },

    async updateTroop(req, res) {
        try {
            const troopId = req.params.id;
            const { name, leaderId } = req.body;
            const teamId = req.user.team_id;

            const isTeamLeader = await troopsService.checkIfTeamLeader(leaderId);
            if (isTeamLeader) {
                return sendError(res, errorMessages.troops.create.leaderIsTeamLeader, 400);
            }

            const currentTroop = await troopsService.fetchTroopById(troopId, teamId);
            if (!currentTroop) {
                return sendError(res, errorMessages.troop.fetchSingle.notFound, 404);
            }

            const oldLeaderId = currentTroop?.leader?.id || null;

            if (oldLeaderId && oldLeaderId !== leaderId) {
                await troopsService.setLeaderFunction(oldLeaderId, 0);
                await troopsService.setLeaderFunction(leaderId, 2);
                await troopsService.assignLeaderToTroop(leaderId, troopId);
            }

            const updatedTroop = await troopsService.updateTroop(troopId, name, leaderId);

            res.status(200).json({
                success: true,
                message: 'Troop updated successfully.',
                data: updatedTroop
            });
        } catch (error) {
            sendError(res, errorMessages.troops.update.default, 500);
        }
    },

    async deleteTroop(req, res) {
        try {
            const troopId = req.params.id;
            const teamId = req.user.team_id;

            const currentTroop = await troopsService.fetchTroopById(troopId, teamId);
            if (!currentTroop) {
                return sendError(res, errorMessages.troop.fetchSingle.notFound, 404);
            }
            const leaderId = currentTroop?.leader?.id || null;

            console.log(leaderId)
            const deleted = await troopsService.deleteTroop(troopId);

            if (!deleted) {
                return sendError(res, errorMessages.troops.delete.notFound, 404);
            }

            if (leaderId) {
                await troopsService.setLeaderFunction(leaderId, 0);
            }

            res.status(200).json({
                success: true,
                message: 'Troop deleted successfully.'
            });
        } catch (error) {
            sendError(res, errorMessages.troops.delete.default, 500);
        }
    }
};

module.exports = troopsController;
