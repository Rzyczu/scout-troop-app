import { usersApi } from './api.js';
import { showToast, showConfirmationModal } from '../../../utils/ui.js';

export const resetForm = async (userForm, userIdField, passwordField, selectUserField, userModalLabel) => {
    userForm.reset();
    userIdField.value = '';
    passwordField.placeholder = 'Enter password';
    passwordField.required = true;
    selectUserField.classList.remove('d-none');
    userModalLabel.textContent = 'Add User';

    // Load all users into the select field
    try {
        const users = await usersApi.fetchAllUsers();
        const selectUser = document.getElementById('selectUser');
        selectUser.innerHTML = '<option value="">Select a user</option>';
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.user_id;
            option.textContent = `${user.name} ${user.surname}`;
            selectUser.appendChild(option);
        });
    } catch (error) {
        showToast(error.message || 'Failed to load users for the select field.', 'danger');
    }
};

export const populateForm = (user, userForm, userIdField, passwordField, selectUserField, userModalLabel) => {
    userIdField.value = user.user_id;
    userForm.email.value = user.email;
    passwordField.placeholder = 'Enter new password or leave blank';
    passwordField.required = false;
    selectUserField.classList.add('d-none');
    userModalLabel.textContent = 'Edit User';
};

export const handleFormSubmit = async (userForm, userIdField, userModal, loadUsers) => {
    const selectUser = document.getElementById('selectUser');
    const userId = parseInt(selectUser.value || userIdField.value, 10);
    const email = userForm.email.value;
    const password = userForm.password.value;

    const data = { user_id: userId, email };
    if (password) data.password = password;

    try {
        if (userIdField.value) {
            // Editing an existing user
            await usersApi.updateUser(userIdField.value, data);
            showToast('User updated successfully!', 'success');
        } else {
            // Adding a new user
            await usersApi.createUser(data);
            showToast('User created successfully!', 'success');
        }
        userModal.hide();
        await loadUsers();
    } catch (error) {
        showToast(error.message || 'Failed to save user. Please try again.', 'danger');
    }
};

/**
 * Obsługuje zdarzenie kliknięcia przycisku edycji użytkownika.
 * @param {HTMLElement} target - Kliknięty przycisk edycji.
 * @param {HTMLFormElement} userForm - Formularz użytkownika.
 * @param {HTMLElement} userIdField - Pole identyfikatora użytkownika.
 * @param {HTMLElement} passwordField - Pole hasła.
 * @param {HTMLElement} selectUserField - Pole wyboru użytkownika.
 * @param {HTMLElement} userModalLabel - Element nagłówka modalnego.
 * @param {HTMLElement} userModal - Modal użytkownika.
 */
export const handleEditUser = async (
    target,
    userForm,
    userIdField,
    passwordField,
    selectUserField,
    userModalLabel,
    userModal
) => {
    const userId = target.dataset.id;

    try {
        const user = await usersApi.fetchUser(userId);
        if (!user) throw new Error('User not found.');

        populateForm(user, userForm, userIdField, passwordField, selectUserField, userModalLabel);
        userModal.show();
    } catch (error) {
        showToast(error.message || 'Failed to fetch user data. Please try again.', 'danger');
    }
};

/**
 * Obsługuje zdarzenie kliknięcia przycisku usunięcia użytkownika.
 * @param {HTMLElement} target - Kliknięty przycisk usunięcia.
 * @param {Function} loadUsers - Funkcja do odświeżania tabeli użytkowników.
 */
export const handleDeleteUser = async (target, loadUsers) => {
    const userId = target.dataset.id;
    console.log(userId);
    try {
        const confirmed = await showConfirmationModal(
            'Delete User',
            'Are you sure you want to delete this user? This action cannot be undone.'
        );
        if (confirmed) {
            await usersApi.deleteUser(userId);
            showToast('User deleted successfully!', 'success');
            await loadUsers();
        }
    } catch (error) {
        showToast(error.message || 'Failed to delete user. Please try again.', 'danger');
    }
};
