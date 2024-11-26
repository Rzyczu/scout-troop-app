// ./utils/helpers.js

/**
 * Populates a `<select>` element with options based on enum data.
 * @param {string} selectId - The ID of the `<select>` element.
 * @param {object} enumData - The data to populate the select options (key-value pairs).
 */
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

/**
 * Adds the `sortable` class to all table headers except for those containing the word "actions".
 * @param {HTMLElement} tableHeaders - The parent element containing the table headers (`<th>`).
 */
export const addSortableClassToHeaders = (tableHeaders) => {
    const headers = tableHeaders.querySelectorAll('th');

    headers.forEach((header) => {
        if (!header.textContent.trim().toLowerCase().includes('actions')) {
            header.classList.add('sortable');
        }
    });
};

/**
 * Attaches sorting functionality to table headers.
 * @param {HTMLElement} tableHeaders - The parent element containing the table headers (`<th>`).
 * @param {HTMLElement} tableBody - The `<tbody>` element of the table to be sorted.
 */
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