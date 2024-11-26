// ./components/form.js

import { api } from './api.js';
import { showToast } from '../../utils/ui.js';

export const resetForm = async (formElements, loadAllUsers) => {
    const { userForm, userIdField, passwordField, selectUserField, selectUser, userModalLabel } = formElements;

    userForm.reset();
    userIdField.value = '';
    passwordField.placeholder = '';
    selectUserField.classList.remove('d-none');
    passwordField.setAttribute('required', 'required');
    selectUser.setAttribute('required', 'required');
    userModalLabel.textContent = 'Add User';
    await loadAllUsers();
};

export const handleFormSubmit = async (event, formElements, loadUsers) => {
    event.preventDefault();

    const { userForm, userIdField, selectUser, passwordField } = formElements;

    if (!userForm.checkValidity()) {
        userForm.classList.add('was-validated');
        return;
    }

    const userId = parseInt(selectUser.value || userIdField.value, 10);
    const email = document.getElementById('email').value;
    const password = passwordField.value;

    const data = { user_id: userId, email };
    if (password) data.password = password;

    try {
        if (userIdField.value) {
            await api.updateUser(userIdField.value, data);
        } else {
            await api.createUser(data);
        }
        showToast('User saved successfully!', 'success');
        loadUsers();
    } catch (error) {
        showToast(error.message || 'Failed to save the user.', 'danger');
    }
};
