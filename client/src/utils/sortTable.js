import { updateTableRowIds } from './tableUtils.js';

export function sortTable(tableBody, columnSelector, direction) {
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    rows.sort((a, b) => {
        const aCell = a.querySelector(columnSelector)?.textContent.trim() || '';
        const bCell = b.querySelector(columnSelector)?.textContent.trim() || '';

        if (!isNaN(aCell) && !isNaN(bCell)) {
            return direction * (parseFloat(aCell) - parseFloat(bCell));
        }

        return direction * aCell.localeCompare(bCell, undefined, { numeric: true });
    });

    tableBody.innerHTML = '';
    rows.forEach(row => tableBody.appendChild(row));

    updateTableRowIds(tableBody);
}

export const addSortableClassToHeaders = (tableHeaders) => {
    const headers = tableHeaders.querySelectorAll('th');

    headers.forEach((header) => {
        if (!header.textContent.trim().toLowerCase().includes('actions') && header.textContent.trim().toLowerCase() !== 'id') {
            header.classList.add('sortable');
        }
    });
};

export const attachSortingToHeaders = (usersTableHeader, usersTableBody, sortTable) => {
    let sortColumn = null;
    let sortDirection = 1; // 1 = rosnąco, -1 = malejąco

    const headers = usersTableHeader.querySelectorAll('.sortable');

    headers.forEach((header, index) => {
        const icon = header.querySelector('.sort-icon') || createSortIcon(header);

        header.addEventListener('click', () => {
            const columnSelector = `td:nth-child(${index + 2})`; // Zaczynamy od 2, bo 1 to ID

            // Jeśli kliknięto na tę samą kolumnę, zmieniamy kierunek sortowania
            if (sortColumn === columnSelector) {
                sortDirection *= -1;
            } else {
                sortColumn = columnSelector;
                sortDirection = 1;
            }

            // Resetowanie wszystkich strzałek do domyślnego stanu
            headers.forEach((h) => {
                const icon = h.querySelector('.sort-icon');
                if (icon) {
                    icon.textContent = '\u2B06'; // Strzałka w górę
                }
            });

            // Aktualizacja strzałki w aktualnie sortowanej kolumnie
            icon.textContent = sortDirection === 1 ? '\u2B06' : '\u2B07'; // ⬆️ lub ⬇️
            icon.style.color = 'black'; // Czarny kolor dla aktywnej strzałki

            // Sortowanie wierszy
            sortTable(usersTableBody, columnSelector, sortDirection);
        });
    });
};

const createSortIcon = (header) => {
    const sortIcon = document.createElement('span');
    sortIcon.className = 'sort-icon';
    sortIcon.textContent = '\u2B06'; // Domyślna strzałka w górę
    sortIcon.style.marginLeft = '5px'; // Dodanie odstępu od tekstu
    header.appendChild(sortIcon);
    return sortIcon;
};