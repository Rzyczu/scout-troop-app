const membersService = require('./members.service');
const { errorMessages, sendError } = require('../../utils/errorManager');



const membersController = {
    async fetchAllMembers(req, res) {
        try {
            const teamId = req.user.team_id;
            const gender = req.user.gender;
            const members = await membersService.fetchAllMembers(teamId);

            const membersWithGender = members.map(member => ({
                ...member,
                gender: gender
            }));

            res.status(200).json({ success: true, data: membersWithGender });
        } catch (err) {
            console.error('Error fetching members:', err);
            sendError(res, errorMessages.users.fetchAll);
        }
    },

    async fetchMemberById(req, res) {
        try {
            const teamId = req.user.team_id;
            const member = await membersService.fetchMemberById(req.params.id, teamId);
            if (!member) {
                return sendError(res, errorMessages.users.fetchSingle.notFound);
            }
            res.status(200).json({ success: true, data: member });
        } catch (err) {
            console.error('Error fetching member:', err);
            sendError(res, errorMessages.users.fetchSingle.default);
        }
    },

    async createMember(req, res) {
        const { user, contact, scout } = req.body;

        if (!user || !contact || !scout) {
            return sendError(res, errorMessages.users.create.validation);
        }

        user.team_id = req.user.team_id;

        try {
            const memberId = await membersService.createMember(user, contact, scout);
            res.status(200).json({ success: true, message: 'Member created successfully.', data: { id: memberId } });
        } catch (err) {
            console.error('Error creating member:', err);
            sendError(res, errorMessages.users.create.default);
        }
    },

    async updateMember(req, res) {
        const { user, contact, scout } = req.body;

        try {
            const currentMember = await membersService.fetchMemberById(req.params.id, req.user.team_id);
            if (!currentMember) {
                return sendError(res, errorMessages.users.fetchSingle.notFound);
            }

            if (currentMember.function == 2 && scout.function != 2) {
                console.log("current")
                console.log(currentMember.function)
                console.log("change")
                console.log(scout.function)
                console.log(currentMember.function !== scout.function)
                console.log(currentMember.function != scout.function)

                const isLeader = await membersService.checkIfUserIsTroopLeader(req.params.id);
                if (isLeader) {
                    return sendError(res, errorMessages.users.update.cannotChangeScoutFunction);
                }
            }

            await membersService.updateMember(req.params.id, user, contact, scout);
            res.status(200).json({ success: true, message: 'Member updated successfully.' });
        } catch (err) {
            console.error('Error updating member:', err);
            sendError(res, errorMessages.users.update.default);
        }
    },

    async deleteMember(req, res) {
        try {

            if (req.user.id === parseInt(req.params.id)) {
                return sendError(res, errorMessages.users.delete.ownAccountDelete);
            }

            const currentMember = await membersService.fetchMemberById(req.params.id, req.user.team_id);
            if (!currentMember) {
                return sendError(res, errorMessages.users.fetchSingle.notFound);
            }

            if (currentMember.function === 2) {
                const isLeader = await membersService.checkIfUserIsTroopLeader(req.params.id);
                if (isLeader) {
                    return sendError(res, errorMessages.users.delete.cannotDeleteScoutLeader);
                }
            }

            const deleted = await membersService.deleteMember(req.params.id);
            if (!deleted) {
                return sendError(res, errorMessages.users.delete.default);
            }
            res.status(200).json({ success: true, message: 'Member deleted successfully.' });
        } catch (err) {
            console.error('Error deleting member:', err);
            sendError(res, errorMessages.users.delete.default);
        }
    },
};

module.exports = membersController;
