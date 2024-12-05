import { troopsApi } from './api.js';
import { showToast } from '../../../utils/ui.js';

export const loadTroops = async (tableBody, getTableRow) => {
    try {
        const troops = await troopsApi.fetchAll();
        tableBody.innerHTML = troops.map((troop, index) => getTableRow(troop, index + 1)).join('');
    } catch (error) {
        showToast(error.message || 'Failed to load troops.', 'danger');
    }
};

export const attachSortingToHeaders = (tableHeaders, tableBody, sortTable) => {
    let currentSortColumn = null;
    let sortDirection = 1;

    tableHeaders.querySelectorAll('.sortable').forEach((header, index) => {
        const columnSelector = `td:nth-child(${index + 1})`;

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
            tableHeaders.forEach((h) => {
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
