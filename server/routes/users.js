const express = require('express');
const bcrypt = require('bcryptjs');
const { authenticateToken } = require('../middlewares/auth');
const { authorize } = require('../middlewares/authorize');
const {
    fetchUsers,
    fetchAllUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
} = require('../services/usersService');
const errorMessages = require('../utils/errorMessages');

const router = express.Router();

const sendError = (res, errorObj) => {
    res.status(200).json({ success: false, ...errorObj });
};

// Fetch all users
router.get('/', authenticateToken, authorize([4]), async (req, res) => {
    try {
        const users = await fetchUsers();
        res.status(200).json({ success: true, data: users });
    } catch (err) {
        sendError(res, errorMessages.users.fetchAll);
    }
});


// Fetch all users (including those without login rights)
router.get('/all', authenticateToken, authorize([4]), async (req, res) => {
    try {
        const users = await fetchAllUsers();
        console.log(users)
        res.status(200).json({ success: true, data: users });
    } catch (err) {
        console.error('Error fetching all users:', err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Fetch a single user by ID
router.get('/:id', authenticateToken, authorize([4]), async (req, res) => {
    try {
        const user = await fetchUserById(req.params.id);
        if (!user) {
            return sendError(res, errorMessages.users.fetchSingle.notFound);
        }
        res.status(200).json({ success: true, data: user });
    } catch (err) {
        sendError(res, errorMessages.users.fetchSingle.default);
    }
});

// Create a user
router.post('/', authenticateToken, authorize([4]), async (req, res) => {
    const { user_id, email, password } = req.body;

    if (!user_id || !email || !password || password.length < 6) {
        return sendError(res, errorMessages.users.create.validation);
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await createUser(user_id, email, hashedPassword);
        res.status(200).json({ success: true, message: 'User created successfully.' });
    } catch (err) {
        const error = err.code === '23505' ? errorMessages.users.create.duplicate : errorMessages.users.create.default;
        sendError(res, error);
    }
});

// Update a user
router.put('/:id', authenticateToken, authorize([4]), async (req, res) => {
    const { email, password } = req.body;

    try {
        const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
        await updateUser(req.params.id, email, hashedPassword);
        res.status(200).json({ success: true, message: 'User updated successfully.' });
    } catch (err) {
        sendError(res, errorMessages.users.update.default);
    }
});

// Delete a user
router.delete('/:id', authenticateToken, authorize([4]), async (req, res) => {
    try {
        if (req.user.id === parseInt(req.params.id)) {
            return sendError(res, errorMessages.users.delete.ownAccountDelete);
        }

        const deleted = await deleteUser(req.params.id);
        if (!deleted) {
            return sendError(res, errorMessages.users.delete.notFound);
        }

        res.status(200).json({ success: true, message: 'User deleted successfully.' });
    } catch (err) {
        sendError(res, errorMessages.users.delete.default);
    }
});

module.exports = router;
