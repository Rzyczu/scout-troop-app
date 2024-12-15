import './users.scss';
import TableComponent from '../../components/table/TableComponent.js';
import usersApi from './components/api.js';
import { resetForm, handleFormSubmit, handleEditUser, handleDeleteUser } from './components/form.js';
import headersConfig from './config/headers.js';
import initializeFormValidation from '../../utils/formValidation.js';

// DOM elements
const userForm = document.getElementById('userForm');
const selectUserField = document.getElementById('selectUserField');
const userModalLabel = document.getElementById('userModalLabel');
const userModal = new bootstrap.Modal(document.getElementById('userModal'));

document.addEventListener('DOMContentLoaded', async () => {
    initializeFormValidation();

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
