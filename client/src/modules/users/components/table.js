// ./components/table.js

import { usersApi } from './api.js';
import { showToast } from '../../../utils/ui.js';

export const loadUsers = async (usersTableBody, usersTableHeader, addSortableClassToHeaders, sortTable) => {
    try {
        const users = await usersApi.fetchUsers();

        // Add sortable functionality to table headers
        addSortableClassToHeaders(usersTableHeader);
        attachSortingToHeaders(usersTableHeader, usersTableBody, sortTable);

        usersTableBody.innerHTML = users.map((user, index) =>
            `<tr>
                <td>${index + 1}</td>
                <td>${user.name}</td>
                <td>${user.surname}</td>
                <td>${user.email}</td>
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

const attachSortingToHeaders = (usersTableHeader, usersTableBody, sortTable) => {
    let sortColumn = 'td:nth-child(1)'; // Domyślnie sortuj wg pierwszej kolumny
    let sortDirection = 1; // 1 = rosnąco, -1 = malejąco

    // Wstępne posortowanie
    sortTable(usersTableBody, sortColumn, sortDirection);

    const headers = usersTableHeader.querySelectorAll('.sortable');
    headers.forEach((header, index) => {
        const icon = header.querySelector('.sort-icon') || createSortIcon(header);

        header.addEventListener('click', () => {
            const columnSelector = `td:nth-child(${index + 1})`;

            // Zmień kierunek sortowania lub ustaw nową kolumnę
            if (sortColumn === columnSelector) {
                sortDirection *= -1;
            } else {
                sortColumn = columnSelector;
                sortDirection = 1;
            }

            // Reset ikon sortowania
            headers.forEach((h) => {
                const icon = h.querySelector('.sort-icon');
                if (icon) icon.textContent = '';
            });

            // Ustaw aktywną ikonę
            icon.textContent = sortDirection === 1 ? '▲' : '▼';

            // Sortuj tabelę
            sortTable(usersTableBody, columnSelector, sortDirection);
        });
    });
};

const createSortIcon = (header) => {
    const sortIcon = document.createElement('span');
    sortIcon.className = 'sort-icon';
    header.appendChild(sortIcon);
    return sortIcon;
};