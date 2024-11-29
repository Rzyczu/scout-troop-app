const express = require('express');
const { authorize, redirectIfNotAuthenticated } = require('../../middlewares/auth');
const usersController = require('./users.controller');

const router = express.Router();

router.get('/', redirectIfNotAuthenticated, authorize([4]), usersController.fetchUsers);
router.get('/all', redirectIfNotAuthenticated, authorize([4]), usersController.fetchAllUsers);
router.get('/:id', redirectIfNotAuthenticated, authorize([4]), usersController.fetchUserById);
router.post('/', redirectIfNotAuthenticated, authorize([4]), usersController.createUser);
router.put('/:id', redirectIfNotAuthenticated, authorize([4]), usersController.updateUser);
router.delete('/:id', redirectIfNotAuthenticated, authorize([4]), usersController.deleteUser);

module.exports = router;
