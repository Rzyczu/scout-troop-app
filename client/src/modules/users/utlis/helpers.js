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
        // Create and append a sort icon if not already present
        let sortIcon = header.querySelector('.sort-icon');
        if (!sortIcon) {
            sortIcon = document.createElement('span');
            sortIcon.className = 'sort-icon';
            header.appendChild(sortIcon);
        }

        // Add click event listener for sorting
        header.addEventListener('click', () => {
            const columnSelector = `td:nth-child(${index + 1})`;

            // Toggle the sort direction or set a new column for sorting
            if (currentSortColumn === columnSelector) {
                sortDirection *= -1;
            } else {
                currentSortColumn = columnSelector;
                sortDirection = 1;
            }

            // Reset all icons and set the active one
            headers.forEach((h) => {
                const icon = h.querySelector('.sort-icon');
                if (icon) icon.textContent = '';
            });
            sortIcon.textContent = sortDirection === 1 ? '▲' : '▼';

            // Perform table sorting
            sortTable(tableBody, columnSelector, sortDirection);
        });
    });
};

export const populateSelect = (selectId, data) => {
    const select = document.getElementById(selectId);

    if (!select) {
        console.warn(`Select element with ID '${selectId}' not found.`);
        return;
    }

    select.innerHTML = ''; // Clear any existing options

    Object.entries(data).forEach(([key, value]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = typeof value === 'string' ? value : value.full || value.short || key;
        select.appendChild(option);
    });
};
