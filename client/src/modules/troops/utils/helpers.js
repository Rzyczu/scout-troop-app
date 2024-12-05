import { populateSelect as basePopulateSelect, addSortableClassToHeaders } from '../../../utils/helpers';

/**
 * Populates a select element with troop leaders.
 * @param {string} selectId - The ID of the select element.
 * @param {Array} leaders - Array of leaders to populate the select with.
 */
export const populateLeaderSelect = (selectId, leaders) => {
    const select = document.getElementById(selectId);

    if (!select) {
        console.warn(`Select element with ID '${selectId}' not found.`);
        return;
    }

    select.innerHTML = '<option value="">Select a leader</option>'; // Clear previous options

    leaders.forEach((leader) => {
        const option = document.createElement('option');
        option.value = leader.id;
        option.textContent = `${leader.name} ${leader.surname}`;
        select.appendChild(option);
    });
};

/**
 * Adds sortable class to headers in the troops table.
 * @param {HTMLElement} tableHeaders - The table header element.
 */
export const addSortableHeadersToTroops = (tableHeaders) => {
    addSortableClassToHeaders(tableHeaders);
};

export const attachSortingToHeaders = (tableHeaders, tableBody, sortTable) => {
    const headers = tableHeaders.querySelectorAll('.sortable');
    let currentSortColumn = null;
    let sortDirection = 1;

    headers.forEach((header, index) => {
        const columnSelector = `td:nth-child(${index + 1})`;
        let sortIcon = header.querySelector('.sort-icon');
        if (!sortIcon) {
            sortIcon = document.createElement('span');
            sortIcon.className = 'sort-icon';
            header.appendChild(sortIcon);
        }

        header.addEventListener('click', () => {
            if (currentSortColumn === columnSelector) {
                sortDirection *= -1; // Toggle direction
            } else {
                currentSortColumn = columnSelector;
                sortDirection = 1; // Default to ascending
            }

            headers.forEach((h) => {
                const icon = h.querySelector('.sort-icon');
                if (icon) icon.textContent = '';
            });

            sortIcon.textContent = sortDirection === 1 ? '▲' : '▼';
            sortTable(tableBody, columnSelector, sortDirection);
        });
    });
};
