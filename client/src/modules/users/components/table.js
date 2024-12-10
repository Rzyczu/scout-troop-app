import usersApi from './api.js';
import { showToast } from '../../../utils/ui.js';
import { mapEnumFullName, ScoutFunctions } from "../../../utils/enums";

export const loadUsers = async (usersTableBody) => {
    try {
        const response = await usersApi.fetchUsers();
        const users = response.users;
        const gender = response.gender;

        console.log(users)

        if (users.length === 0) {
            // Jeśli brak zastępów, wyświetl ostrzeżenie i komunikat w tabeli
            showToast('No users available.', 'warning');
            usersTableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center">No users to display. Add a user to get started.</td>
                </tr>
            `;
            return;
        };

        usersTableBody.innerHTML = users.map((user, index) =>
            `<tr>
                <td>${index + 1}</td>
                <td>${user.name}</td>
                <td>${user.surname}</td>
                <td>${user.email}</td>
                <td>${mapEnumFullName(ScoutFunctions, user.function, gender) || '-'}</td>
                <td>
                    <button class="btn btn-secondary btn-sm editUserBtn" data-id="${user.user_id}">Edit</button>
                    <button class="btn btn-danger btn-sm deleteUserBtn" data-id="${user.user_id}">Delete</button>
                </td>
            </tr>`
        ).join('');
    } catch (error) {
        showToast(error.message || 'Failed to load users. Please try again.', 'danger');
    }
};