import usersApi from './api.js';
import { showToast } from '../../../utils/ui.js';
import headersConfig from '../config/headers.js';

export const loadUsers = async (usersTableBody) => {
    try {
        const usersTableHeader = document.getElementById('tableHeaders');
        const response = await usersApi.fetchUsers();
        const users = response.users;
        const gender = response.gender;

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

        usersTableHeader.innerHTML = `${getTableHeaders()}`;
        usersTableBody.innerHTML = renderTableRows(users, gender);

    } catch (error) {
        showToast(error.message || 'Failed to load users. Please try again.', 'danger');
    }
};

export const getTableHeaders = () => {
    return headersConfig.map(header =>
        `<th>${header.label}</th>`
    ).join('');
};

export const renderTableRows = (users, gender) => {
    return users.map(user => {
        const rowCells = headersConfig
            .filter(col => col.key)
            .map(col => {
                const value = user[col.key] || '-';
                return `<td>${col.formatter ? col.formatter(value, gender) : value}</td>`;
            })
            .join('');

        return `
        <tr>
            <td class="dynamic-id"></td>
            ${rowCells}
            <td>
                <button class="btn btn-secondary btn-sm editUserBtn" data-id="${user.user_id}">Edit</button>
                <button class="btn btn-danger btn-sm deleteUserBtn" data-id="${user.user_id}">Delete</button>
            </td>
        </tr>
        `;
    }).join('');
};