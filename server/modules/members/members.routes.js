const express = require('express');
const { authenticateToken } = require('../../middlewares/auth');
const { authorize } = require('../../middlewares/authorize');
const membersController = require('./members.controller');

const router = express.Router();

// Trasy dla members
router.get('/', authenticateToken, authorize([3, 4]), membersController.fetchAllMembers); // Pobieranie wszystkich użytkowników
router.get('/:id', authenticateToken, authorize([3, 4]), membersController.fetchMemberById); // Pobieranie użytkownika po ID
router.post('/', authenticateToken, authorize([3, 4]), membersController.createMember); // Tworzenie nowego użytkownika
router.put('/:id', authenticateToken, authorize([3, 4]), membersController.updateMember); // Edycja użytkownika po ID
router.delete('/:id', authenticateToken, authorize([3, 4]), membersController.deleteMember); // Usuwanie użytkownika po ID

module.exports = router;
