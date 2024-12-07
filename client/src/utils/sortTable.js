/**
 * Sorts an HTML table based on the selected column and direction.
 * 
 * @param {HTMLElement} tableBody - The table body (tbody) element containing rows.
 * @param {string} columnSelector - The data attribute or CSS selector for the column to sort by.
 * @param {number} direction - The sort direction: 1 for ascending, -1 for descending.
 */
export function sortTable(tableBody, columnSelector, direction) {
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    rows.sort((a, b) => {
        const aCell = a.querySelector(columnSelector)?.textContent.trim() || '';
        const bCell = b.querySelector(columnSelector)?.textContent.trim() || '';

        // Numeric comparison
        if (!isNaN(aCell) && !isNaN(bCell)) {
            return direction * (parseFloat(aCell) - parseFloat(bCell));
        }

        // String comparison
        return direction * aCell.localeCompare(bCell, undefined, { numeric: true });
    });

    // Rebuild the table body with sorted rows
    tableBody.innerHTML = '';
    rows.forEach(row => tableBody.appendChild(row));
}

export const addSortableClassToHeaders = (tableHeaders) => {
    const headers = tableHeaders.querySelectorAll('th');

    headers.forEach((header) => {
        if (!header.textContent.trim().toLowerCase().includes('actions')) {
            header.classList.add('sortable');
        }
    });
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
