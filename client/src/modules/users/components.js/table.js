// ./components/table.js

import { api } from './api.js';
import { showToast } from '../../utils/ui.js';
import sortTable from '../../utils/sortTable.js';

export const loadUsers = async (usersTableBody) => {
    try {
        const users = await api.fetchUsers();
        usersTableBody.innerHTML = users.map((user, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${user.name}</td>
                <td>${user.surname}</td>
                <td>${user.email}</td>
                <td>
                    <button class="btn btn-secondary btn-sm editUserBtn" data-id="${user.user_id}">Edit</button>
                    <button class="btn btn-danger btn-sm deleteUserBtn" data-id="${user.user_id}">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        showToast('Failed to load users.', 'danger');
    }
};

export const attachSortingToHeaders = (usersTableHeader, usersTableBody) => {
    let sortColumn = `td:nth-child(1)`; // Default sort column
    let sortDirection = 1;

    sortTable(usersTableBody, sortColumn, sortDirection);

    const headers = usersTableHeader.querySelectorAll('.sortable');
    headers.forEach((header, index) => {
        const icon = header.querySelector('.sort-icon');
        header.addEventListener('click', () => {
            const columnSelector = `td:nth-child(${index + 1})`;
            if (sortColumn === columnSelector) {
                sortDirection *= -1;
            } else {
                sortColumn = columnSelector;
                sortDirection = 1;
            }

            headers.forEach(h => h.querySelector('.sort-icon').textContent = '');
            icon.textContent = sortDirection === 1 ? '▲' : '▼';

            sortTable(usersTableBody, columnSelector, sortDirection);
        });
    });
};
