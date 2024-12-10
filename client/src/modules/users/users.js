import './users.scss';
import { loadUsers } from './components/table.js';
import { resetForm, handleFormSubmit, handleEditUser, handleDeleteUser } from './components/form.js';
import { sortTable, addSortableClassToHeaders, attachSortingToHeaders } from '../../utils/sortTable.js';
import initializeFormValidation from '../../utils/formValidation.js';

// DOM elements
const usersTableBody = document.getElementById('usersTableBody');
const usersTableHeader = document.querySelector('thead');
const userForm = document.getElementById('userForm');
const userModalLabel = document.getElementById('userModalLabel');
const userModal = new bootstrap.Modal(document.getElementById('userModal'));

userForm.onsubmit = async function (event) {
    event.preventDefault();
    if (!this.checkValidity()) {
        this.classList.add('was-validated');
        return;
    }
    await handleFormSubmit(userForm, userModal, async () => loadUsers(usersTableBody));
};

// Event listeners
document.addEventListener('DOMContentLoaded', async () => {
    initializeFormValidation()

    try {
        // Load users into the table
        await loadUsers(usersTableBody);

        addSortableClassToHeaders(usersTableHeader);
        attachSortingToHeaders(usersTableHeader, usersTableBody, sortTable);

        // Add event listener for form submission


        // Add event listener for "Add User" button
        document.getElementById('addUserBtn').addEventListener('click', async () => {
            await resetForm(userForm, userModalLabel, ['userId', 'email', 'password'], 'selectUser');
            userModal.show();
        });

        // Add event listener for table actions (edit/delete)
        usersTableBody.addEventListener('click', async (event) => {
            const target = event.target;

            // Handle Edit button using handleEditUser
            if (target.classList.contains('editUserBtn')) {
                await handleEditUser(target, userForm, userModalLabel, userModal);
            }

            // Handle Delete button using handleDeleteUser
            else if (target.classList.contains('deleteUserBtn')) {
                await handleDeleteUser(target, async () => loadUsers(usersTableBody));
            }
        });
    } catch (error) {
        console.error('Error initializing users module:', error);
    }
});
