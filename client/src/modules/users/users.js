import './users.scss';
import { loadUsers } from './components/table.js';
import { resetForm, handleFormSubmit, handleEditUser, handleDeleteUser } from './components/form.js';
import { sortTable, addSortableClassToHeaders, attachSortingToHeaders } from '../../utils/sortTable.js';
import initializeFormValidation from '../../utils/formValidation.js';
import headersConfig from './config/headers.js';
import { showColumnManagerModal, applyColumnPreferences } from '../../utils/columnManager.js';

// DOM elements
const usersTableBody = document.getElementById('tableBody');
const usersTableHeader = document.getElementById('tableHeaders');
const userForm = document.getElementById('userForm');
const selectUserField = document.getElementById('selectUserField');
const userModalLabel = document.getElementById('userModalLabel');
const userModal = new bootstrap.Modal(document.getElementById('userModal'));

userForm.onsubmit = async function (event) {
    event.preventDefault();
    if (!this.checkValidity()) {
        this.classList.add('was-validated');
        return;
    }
    await handleFormSubmit(userForm, userModal, reloadTable);
};

const reloadTable = async () => {
    await loadUsers(usersTableBody);
    addSortableClassToHeaders(usersTableHeader, headersConfig);
    attachSortingToHeaders(usersTableHeader, usersTableBody, sortTable);
    applyColumnPreferences('users', 'default', usersTableHeader, usersTableBody);
};

// Event listeners
document.addEventListener('DOMContentLoaded', async () => {
    initializeFormValidation()

    try {
        // Load users into the table
        await loadUsers(usersTableBody);

        addSortableClassToHeaders(usersTableHeader, headersConfig);
        attachSortingToHeaders(usersTableHeader, usersTableBody, sortTable);

        // Add event listener for form submission


        // Add event listener for "Add User" button
        document.getElementById('addUserBtn').addEventListener('click', async () => {
            await resetForm(userForm, userModalLabel, ['userId', 'email', 'password'], selectUserField);
            userModal.show();
        });

        // Add event listener for "Set Columns" button
        document.getElementById('setColumnsBtn')?.addEventListener('click', () => {
            const columns = headersConfig.map(header => header.label);
            showColumnManagerModal('users', 'default', columns, usersTableHeader, usersTableBody);
        });


        // Add event listener for table actions (edit/delete)
        usersTableBody.addEventListener('click', async (event) => {
            const target = event.target;

            // Handle Edit button using handleEditUser
            if (target.classList.contains('editUserBtn')) {
                await handleEditUser(target, userModalLabel, userModal, selectUserField);
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
