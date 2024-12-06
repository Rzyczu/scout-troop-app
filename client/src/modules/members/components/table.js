import membersApi from './api.js';
import { showToast } from '../../../utils/ui.js';

export const loadTable = async (tableBody, getTableRow, view) => {
    try {
        const response = await membersApi.fetchAll();
        const members = response.members;
        const gender = response.gender;
        tableBody.innerHTML = members.map((member, index) => getTableRow(member, index + 1, view, gender)).join('');
        return gender;
    } catch (error) {
        showToast(error.message || 'Failed to load members.', 'danger');
        return null;
    }
};

export const attachSortingToHeaders = (usersTableHeader, usersTableBody, sortTable) => {
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