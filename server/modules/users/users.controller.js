const bcrypt = require('bcryptjs');
const usersService = require('./users.service');
const { errorMessages, sendError } = require('../../utils/errorManager');

const usersController = {
    async fetchUsers(req, res) {
        try {
            const teamId = req.user.team_id;
            const users = await usersService.fetchUsers(teamId);

            res.status(200).json({ success: true, data: users });
        } catch (err) {
            sendError(res, errorMessages.users.fetchAll);
        }
    },

    async fetchAllUsers(req, res) {
        try {
            const teamId = req.user.team_id;
            const users = await usersService.fetchAllUsers(teamId);
            res.status(200).json({ success: true, data: users });
        } catch (err) {
            console.error('Error fetching all users:', err);
            res.status(500).json({ error: 'Failed to fetch users' });
        }
    },

    async fetchUserById(req, res) {
        try {
            const teamId = req.user.team_id;
            const user = await usersService.fetchUserById(req.params.id, teamId); if (!user) {
                return sendError(res, errorMessages.users.fetchSingle.notFound);
            }
            res.status(200).json({ success: true, data: user });
        } catch (err) {
            sendError(res, errorMessages.users.fetchSingle.default);
        }
    },

    async createUser(req, res) {
        const { id, email, password } = req.body;
        console.log("body")
        console.log(id, email, password)

        if (!id || !email || !password || password.length < 6) {
            return sendError(res, errorMessages.users.create.validation);
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            await usersService.createUser(id, email, hashedPassword);
            res.status(200).json({ success: true, message: 'User created successfully.' });
        } catch (err) {
            if (err.code === '23505') {
                const isLoginDuplicate = err.detail.includes('(user_id)');
                const error = isLoginDuplicate
                    ? errorMessages.users.create.duplicateLogin
                    : errorMessages.users.create.duplicateEmail;
                sendError(res, error);
            } else {
                sendError(res, errorMessages.users.create.default);
            }
        }
    },

    async updateUser(req, res) {
        const { id, email, password } = req.body;

        try {
            const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
            await usersService.updateUser(id, email, hashedPassword);
            res.status(200).json({ success: true, message: 'User updated successfully.' });
        } catch (err) {
            sendError(res, errorMessages.users.update.default);
        }
    },

    async deleteUser(req, res) {
        const userIdToDelete = req.params.id;
        const currentUserId = req.user.user_id;
        console.log(currentUserId)
        console.log(userIdToDelete)

        try {
            if (currentUserId === userIdToDelete) {
                return sendError(res, errorMessages.users.delete.ownAccountDelete);
            }

            const deleted = await usersService.deleteUser(userIdToDelete);
            if (!deleted) {
                return sendError(res, errorMessages.users.delete.notFound);
            }

            res.status(200).json({ success: true, message: 'User deleted successfully.' });
        } catch (err) {
            sendError(res, errorMessages.users.delete.default);
        }
    },
};

module.exports = usersController;
