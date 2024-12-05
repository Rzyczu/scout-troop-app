const express = require('express');
const troopController = require('./troop.controller');
const { redirectIfNotAuthenticated, authorize } = require('../../middlewares/auth');

const router = express.Router();

router.get('/:id', redirectIfNotAuthenticated, authorize([3, 4]), troopController.fetchTroopDetails);
router.put('/:id', redirectIfNotAuthenticated, authorize([3, 4]), troopController.updateTroopDetails);
router.get('/:id/users', redirectIfNotAuthenticated, authorize([3, 4]), troopController.fetchTroopUsers);
router.post('/:id/users/add', redirectIfNotAuthenticated, authorize([3, 4]), troopController.addUserToTroop);
router.post('/:id/users/remove', redirectIfNotAuthenticated, authorize([3, 4]), troopController.removeUserFromTroop);

module.exports = router;
