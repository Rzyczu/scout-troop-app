const troopsService = require('./troops.service');
const { sendError, errorMessages } = require('../../utils/errorManager');

const troopsController = {
    async fetchAllTroops(req, res) {
        try {
            const teamId = req.user.team_id;
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

            console.log(teamId)
            console.log(req.body)
            if (!name || !leaderId) {
                return sendError(res, errorMessages.troops.create.validation, 400);
            }

            // 1. Sprawdź, czy leader nie jest już liderem innego zastępu
            const existingLeader = await troopsService.checkIfLeaderExists(leaderId);
            if (existingLeader) {
                console.log("err 1")
                return sendError(res, errorMessages.troops.create.leaderAlreadyAssigned, 400);
            }

            // 2. Sprawdź, czy leader nie jest drużynowym
            const isTeamLeader = await troopsService.checkIfTeamLeader(leaderId);
            if (isTeamLeader) {
                console.log("err 2")
                return sendError(res, errorMessages.troops.create.leaderIsTeamLeader, 400);
            }

            // 3. Tworzenie nowego zastępu
            const troopId = await troopsService.createTroop({ name, leaderId, teamId });
            console.log("created", troopId)

            // 4.1. Ustawienie funkcji lidera na 2 w users_scout (ustawienie funkcji jako 'Zastępowy')
            await troopsService.setLeaderFunction(leaderId, 2);
            console.log("setLeaderFunction", troopId)

            // 4.2. Ustawienie troop_id w users_scout
            await troopsService.assignLeaderToTroop(leaderId, troopId);
            console.log("assignLeaderToTroop", troopId)

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
