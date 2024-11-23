const bcrypt = require('bcryptjs');
const usersService = require('./users.service');
const errorMessages = require('../../utils/errorMessages');

const sendError = (res, errorObj) => {
    res.status(200).json({ success: false, ...errorObj });
};

const usersController = {
    async fetchUsers(req, res) {
        try {
            const users = await usersService.fetchUsers();
            res.status(200).json({ success: true, data: users });
        } catch (err) {
            sendError(res, errorMessages.users.fetchAll);
        }
    },

    async fetchAllUsers(req, res) {
        try {
            const users = await usersService.fetchAllUsers();
            res.status(200).json({ success: true, data: users });
        } catch (err) {
            console.error('Error fetching all users:', err);
            res.status(500).json({ error: 'Failed to fetch users' });
        }
    },

    async fetchUserById(req, res) {
        try {
            const user = await usersService.fetchUserById(req.params.id);
            if (!user) {
                return sendError(res, errorMessages.users.fetchSingle.notFound);
            }
            res.status(200).json({ success: true, data: user });
        } catch (err) {
            sendError(res, errorMessages.users.fetchSingle.default);
        }
    },

    async createUser(req, res) {
        const { user_id, email, password } = req.body;

        if (!user_id || !email || !password || password.length < 6) {
            return sendError(res, errorMessages.users.create.validation);
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            await usersService.createUser(user_id, email, hashedPassword);
            res.status(200).json({ success: true, message: 'User created successfully.' });
        } catch (err) {
            const error = err.code === '23505' ? errorMessages.users.create.duplicate : errorMessages.users.create.default;
            sendError(res, error);
        }
    },

    async updateUser(req, res) {
        const { email, password } = req.body;

        try {
            const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
            await usersService.updateUser(req.params.id, email, hashedPassword);
            res.status(200).json({ success: true, message: 'User updated successfully.' });
        } catch (err) {
            sendError(res, errorMessages.users.update.default);
        }
    },

    async deleteUser(req, res) {
        try {
            if (req.user.id === parseInt(req.params.id)) {
                return sendError(res, errorMessages.users.delete.ownAccountDelete);
            }

            const deleted = await usersService.deleteUser(req.params.id);
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