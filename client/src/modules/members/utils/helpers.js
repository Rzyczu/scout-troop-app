export const populateSelect = (selectId, enumData) => {
    const select = document.getElementById(selectId);
    if (!select) {
        console.warn(`Select element with ID '${selectId}' not found.`);
        return;
    }

    Object.entries(enumData).forEach(([key, value]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = typeof value === 'string' ? value : value.full || value.short;
        select.appendChild(option);
    });
};

export const addSortableClassToHeaders = (tableHeaders) => {
    const headers = tableHeaders.querySelectorAll('th');

    headers.forEach((header) => {
        if (!header.textContent.trim().toLowerCase().includes('actions')) {
            header.classList.add('sortable');
        }
    });
};

export const attachSortingToHeaders = (tableHeaders, tableBody, sortTable) => {
    const headers = tableHeaders.querySelectorAll('.sortable');
    let currentSortColumn = null;
    let sortDirection = 1;

    headers.forEach((header, index) => {
        let sortIcon = header.querySelector('.sort-icon');
        if (!sortIcon) {
            sortIcon = document.createElement('span');
            sortIcon.className = 'sort-icon';
            header.appendChild(sortIcon);
        }

        header.addEventListener('click', () => {
            const columnSelector = `td:nth-child(${index + 1})`;

            if (currentSortColumn === columnSelector) {
                sortDirection *= -1; // Toggle sort direction
            } else {
                currentSortColumn = columnSelector;
                sortDirection = 1; // Default to ascending order
            }

            // Reset sort icons
            headers.forEach(h => {
                const icon = h.querySelector('.sort-icon');
                if (icon) {
                    icon.textContent = '';
                }
            });

            // Set the active sort icon
            sortIcon.textContent = sortDirection === 1 ? '▲' : '▼';

            // Perform sorting
            sortTable(tableBody, columnSelector, sortDirection);
        });
    });
};