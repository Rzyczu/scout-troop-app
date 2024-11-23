const membersService = require('./members.service');
const errorMessages = require('../../utils/errorMessages');

const sendError = (res, errorObj) => {
    res.status(200).json({ success: false, ...errorObj });
};

const membersController = {
    async fetchAllMembers(req, res) {
        try {
            const members = await membersService.fetchAllMembers();
            res.status(200).json({ success: true, data: members });
        } catch (err) {
            console.error('Error fetching members:', err);
            sendError(res, errorMessages.users.fetchAll);
        }
    },

    async fetchMemberById(req, res) {
        try {
            const member = await membersService.fetchMemberById(req.params.id);
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
            await membersService.updateMember(req.params.id, user, contact, scout);
            res.status(200).json({ success: true, message: 'Member updated successfully.' });
        } catch (err) {
            console.error('Error updating member:', err);
            sendError(res, errorMessages.users.update.default);
        }
    },

    async deleteMember(req, res) {
        try {
            const deleted = await membersService.deleteMember(req.params.id);
            if (!deleted) {
                return sendError(res, errorMessages.users.delete.notFound);
            }
            res.status(200).json({ success: true, message: 'Member deleted successfully.' });
        } catch (err) {
            console.error('Error deleting member:', err);
            sendError(res, errorMessages.users.delete.default);
        }
    },
};

module.exports = membersController;