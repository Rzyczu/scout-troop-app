import './users.scss';
import TableComponent from '../../components/table/TableComponent.js';
import usersApi from './components/api.js';
import { resetForm, handleFormSubmit, handleEditUser, handleDeleteUser } from './components/form.js';
import headersConfig from './config/headers.js';
import initializeFormValidation from '../../utils/formValidation.js';
import { createSelectPopulator } from '../../utils/selectFactory';
import { showToast } from '../../utils/ui.js';

// DOM elements
const userForm = document.getElementById('userForm');
const selectUserField = document.getElementById('selectUserField');
const userModalLabel = document.getElementById('userModalLabel');
const userModal = new bootstrap.Modal(document.getElementById('userModal'));

const populateUserSelect = createSelectPopulator({
    valueField: 'id',
    textField: (user) => `${user.name} ${user.surname}`,
    addNone: true,
});

const fetchAndPopulateMembers = async () => {
    try {
        const response = await usersApi.fetchAllMembers();
        const selectUser = selectUserField.querySelector('select');
        if (!selectUser) {
            console.warn(`Select element with ID '${selectUser.id}' not found.`);
            return;
        }

        const members = Array.isArray(response) ? response : Object.values(response);
        await populateUserSelect(selectUser.id, members);

    } catch (error) {
        showToast(error.message || 'Failed to load users for the select field.', 'danger');
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    initializeFormValidation();
    fetchAndPopulateMembers();
    try {
        const table = new TableComponent({
            containerId: 'tableContainer',
            headersConfig: headersConfig,
            api: usersApi,
            exportEnabled: true,
            onEdit: (id) => handleEditUser({ dataset: { id } }, userModalLabel, userModal, selectUserField),
            onDelete: (id) => handleDeleteUser({ dataset: { id } }, () => table.reloadTable()),
            moduleName: 'users'
        });

        userForm.onsubmit = async function (event) {
            event.preventDefault();
            if (!this.checkValidity()) {
                this.classList.add('was-validated');
                return;
            }
            await handleFormSubmit(userForm, userModal, () => table.reloadTable());
        };

        document.getElementById('addUserBtn').addEventListener('click', async () => {
            await resetForm(userForm, userModalLabel, ['id', 'email', 'password'], selectUserField);
            userModal.show();
        });

    } catch (error) {
        console.error('Error initializing users module:', error);
    }
});
