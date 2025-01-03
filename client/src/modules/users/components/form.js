import usersApi from './api.js';
import { showToast, showConfirmationModal } from '../../../utils/ui.js';

export const resetForm = async (form, modalLabel, fieldsToClear, selectUserField) => {
    form.reset();
    fieldsToClear.forEach((fieldId) => {
        const field = document.getElementById(fieldId);
        if (field) field.value = '';
    });


    selectUserField.classList.remove('d-none');

    modalLabel.textContent = 'Add User';
};


export const handleFormSubmit = async (form, modal, reloadUsers) => {
    const formData = new FormData(form);
    const passwordValue = formData.get('password');
    const userIdFromHiddenField = document.getElementById('userId').value;
    const userIdFromSelect = formData.get('user_id');
    const userIdValue = userIdFromHiddenField ? userIdFromHiddenField : userIdFromSelect; // Ustal jedno źródło

    const payload = {

        id: userIdValue || null,
        email: formData.get('email'),
    };

    if (passwordValue) {
        payload.password = passwordValue;
    }

    try {
        if (userIdFromHiddenField) {
            // Aktualizacja użytkownika
            await usersApi.update(userIdFromHiddenField, payload);
            showToast('User updated successfully!', 'success');
        } else {
            // Tworzenie nowego użytkownika
            await usersApi.create(payload);
            showToast('User created successfully!', 'success');
        }
        modal.hide();
        await reloadUsers();
    } catch (error) {
        showToast(error.message || 'Failed to save user. Please try again.', 'danger');
    }
};

export const handleEditUser = async (target, modalLabel, modal, selectUserField) => {
    const userId = target.dataset.id;
    try {
        const user = await usersApi.fetchById(userId);
        if (!user) throw new Error('User not found.');

        Object.entries({
            userId: user.id,
            email: user.email,
        }).forEach(([key, value]) => {
            const field = document.getElementById(key);
            if (field) field.value = value;
        });

        document.getElementById('password').placeholder = 'Enter new password or leave blank';
        modalLabel.textContent = 'Edit User';

        selectUserField.classList.add('d-none');

        modal.show();
    } catch (error) {
        showToast(error.message || 'Failed to fetch user data. Please try again.', 'danger');
    }
};

export const handleDeleteUser = async (target, reloadUsers) => {
    const userId = target.dataset.id;

    try {
        const confirmed = await showConfirmationModal(
            'Delete User',
            'Are you sure you want to delete this user? This action cannot be undone.'
        );

        if (confirmed) {
            await usersApi.delete(userId);
            showToast('User deleted successfully!', 'success');
            await reloadUsers();
        }
    } catch (error) {
        showToast(error.message || 'Failed to delete user. Please try again.', 'danger');
    }
};
