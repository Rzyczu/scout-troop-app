const express = require('express');
const troopsController = require('./troops.controller');
const { redirectIfNotAuthenticated, authorize } = require('../../middlewares/auth');

const router = express.Router();

router.get('/', redirectIfNotAuthenticated, authorize([3, 4]), troopsController.fetchAllTroops);
router.get('/:id', redirectIfNotAuthenticated, authorize([3, 4]), troopsController.fetchTroopById);
router.post('/', redirectIfNotAuthenticated, authorize([3, 4]), troopsController.createTroop);
router.put('/:id', redirectIfNotAuthenticated, authorize([3, 4]), troopsController.updateTroop);
router.delete('/:id', redirectIfNotAuthenticated, authorize([3, 4]), troopsController.deleteTroop);

module.exports = router;
