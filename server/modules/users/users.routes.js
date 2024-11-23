const express = require('express');
const { authenticateToken } = require('../../middlewares/auth');
const { authorize } = require('../../middlewares/authorize');
const usersController = require('./users.controller');

const router = express.Router();

router.get('/', authenticateToken, authorize([4]), usersController.fetchUsers);
router.get('/all', authenticateToken, authorize([4]), usersController.fetchAllUsers);
router.get('/:id', authenticateToken, authorize([4]), usersController.fetchUserById);
router.post('/', authenticateToken, authorize([4]), usersController.createUser);
router.put('/:id', authenticateToken, authorize([4]), usersController.updateUser);
router.delete('/:id', authenticateToken, authorize([4]), usersController.deleteUser);

module.exports = router;
