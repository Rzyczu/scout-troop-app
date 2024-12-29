// import troopApi from './components/api.js';
// import { loadTroopUsers, attachRemoveUserHandlers } from './components/table.js';
// import { handleEditTroopFormSubmit, handleAddUserFormSubmit, loadAvailableUsers } from './components/form.js';
// import { showToast } from '../../utils/ui.js';

// document.addEventListener('DOMContentLoaded', async () => {
//     const troopId = document.getElementById('troopData').dataset.id;
//     const troopForm = document.getElementById('editTroopForm');
//     const addUserForm = document.getElementById('addUserForm');
//     const userSelect = document.getElementById('userSelect');
//     const usersTableBody = document.getElementById('troopUsersTableBody');

//     // Load troop details
//     try {
//         const troop = await troopApi.fetchTroopById(troopId);
//         document.getElementById('troopName').textContent = troop.name;
//         document.getElementById('troopDescription').textContent = troop.description || 'No description available.';
//         document.getElementById('troopLeader').textContent = troop.leader ? `${troop.leader.name} ${troop.leader.surname}` : 'No leader assigned.';
//     } catch (error) {
//         showToast(error.message || 'Failed to load troop details.', 'danger');
//     }

//     // Load users in the troop
//     const reloadUsers = async () => {
//         await loadTroopUsers(troopId, usersTableBody);
//     };

//     await reloadUsers();

//     // Attach handlers for removing users
//     attachRemoveUserHandlers(usersTableBody, troopId, reloadUsers);

//     // Initialize troop form
//     handleEditTroopFormSubmit(troopForm, troopId);

//     // Initialize add user form
//     await loadAvailableUsers(userSelect);
//     handleAddUserFormSubmit(addUserForm, troopId, reloadUsers);
// });
