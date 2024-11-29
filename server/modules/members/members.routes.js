const express = require('express');
const { authorize, redirectIfNotAuthenticated } = require('../../middlewares/auth');
const membersController = require('./members.controller');

const router = express.Router();

// Trasy dla members
router.get('/', redirectIfNotAuthenticated, authorize([3, 4]), membersController.fetchAllMembers); // Pobieranie wszystkich użytkowników
router.get('/:id', redirectIfNotAuthenticated, authorize([3, 4]), membersController.fetchMemberById); // Pobieranie użytkownika po ID
router.post('/', redirectIfNotAuthenticated, authorize([3, 4]), membersController.createMember); // Tworzenie nowego użytkownika
router.put('/:id', redirectIfNotAuthenticated, authorize([3, 4]), membersController.updateMember); // Edycja użytkownika po ID
router.delete('/:id', redirectIfNotAuthenticated, authorize([3, 4]), membersController.deleteMember); // Usuwanie użytkownika po ID

module.exports = router;
