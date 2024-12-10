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
    let sortColumn = 'td:nth-child(1)';
    let sortDirection = 1; // 1 = rosnąco, -1 = malejąco

    sortTable(usersTableBody, sortColumn, sortDirection);

    const headers = usersTableHeader.querySelectorAll('.sortable');
    headers.forEach((header, index) => {
        const icon = header.querySelector('.sort-icon') || createSortIcon(header);

        if (index === 0) {
            icon.textContent = sortDirection === 1 ? '▲' : '▼';
        }

        header.addEventListener('click', () => {
            const columnSelector = `td:nth-child(${index + 1})`;

            if (sortColumn === columnSelector) {
                sortDirection *= -1;
            } else {
                sortColumn = columnSelector;
                sortDirection = 1;
            }

            headers.forEach((h) => {
                const icon = h.querySelector('.sort-icon');
                if (icon) icon.textContent = '';
            });

            icon.textContent = sortDirection === 1 ? '▲' : '▼';

            sortTable(usersTableBody, columnSelector, sortDirection);
        });

    });
};

const createSortIcon = (header) => {
    const sortIcon = document.createElement('span');
    sortIcon.className = 'sort-icon';
    sortIcon.textContent = '';
    header.appendChild(sortIcon);
    return sortIcon;
};
