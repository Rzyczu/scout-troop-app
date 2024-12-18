import { updateTableRowIds } from './tableUtils.js';

export default class TableSorter {
    constructor({ tableHeaders, tableBody, headersConfig }) {
        this.tableHeaders = tableHeaders;
        this.tableBody = tableBody;
        this.headersConfig = headersConfig;
        this.sortColumn = null;
        this.sortDirection = 1; // 1 = ascending, -1 = descending
        this.initialize();
    }

    initialize() {
        this.attachSortingToHeaders();
    }

    attachSortingToHeaders() {
        this.headersConfig.forEach((headerConfig, index) => {
            if (!headerConfig.sortable) return;
            const headerElement = this.tableHeaders.querySelector(`th:nth-child(${index + 1})`);
            if (!headerElement) return;

            headerElement.classList.add('sortable');
            this.createSortIcon(headerElement);

            headerElement.addEventListener('click', this.debounce(() => {
                const columnSelector = `td:nth-child(${index + 2})`;

                if (this.sortColumn === columnSelector) {
                    this.sortDirection *= -1;
                } else {
                    this.sortColumn = columnSelector;
                    this.sortDirection = 1;
                }

                this.resetActiveSortClasses();
                headerElement.classList.add('active', this.sortDirection === 1 ? 'asc' : 'desc');

                this.sortTable(columnSelector);
            }, 300)); // Debounce delay of 300ms
        });
    }

    sortTable(columnSelector) {
        const rows = Array.from(this.tableBody.querySelectorAll('tr'));

        rows.sort((a, b) => {
            const aCell = a.querySelector(columnSelector)?.textContent.trim() || '';
            const bCell = b.querySelector(columnSelector)?.textContent.trim() || '';

            if (!isNaN(aCell) && !isNaN(bCell)) {
                return this.sortDirection * (parseFloat(aCell) - parseFloat(bCell));
            }

            return this.sortDirection * aCell.localeCompare(bCell, undefined, { numeric: true });
        });

        this.tableBody.innerHTML = '';
        rows.forEach(row => this.tableBody.appendChild(row));

        updateTableRowIds(this.tableBody);
    }

    createSortIcon(header) {
        let sortIcon = header.querySelector('.sort-icon');
        if (!sortIcon) {
            sortIcon = document.createElement('span');
            sortIcon.className = 'sort-icon';
            header.appendChild(sortIcon);
        }
        return sortIcon;
    }

    resetActiveSortClasses() {
        const headers = this.tableHeaders.querySelectorAll('th');
        headers.forEach(header => header.classList.remove('active', 'asc', 'desc'));
    }

    debounce(func, delay) {
        let debounceTimer;
        return function (...args) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(this, args), delay);
        };
    }
}