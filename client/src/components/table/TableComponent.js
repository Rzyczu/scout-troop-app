import './table.scss';
import TableSorter from '../../utils/TableSorter.js';
import ColumnManager from '../../utils/ColumnManager.js';
import { updateTableRowIds } from '../../utils/tableUtils.js';
import { showToast, showTooltip } from '../../utils/ui.js';
import { checkRankAdequacy } from '../../utils/adequacy.js';
import ExcelJS from 'exceljs';

class TableComponent {
    constructor({ containerId, headersConfig, api, onEdit, onDelete, exportEnabled = true, columnManagerEnabled = true, enableAdequacy = false }) {
        this.containerId = containerId;
        this.headersConfig = headersConfig;
        this.api = api;
        this.onEdit = onEdit;
        this.onDelete = onDelete;
        this.exportEnabled = exportEnabled;
        this.columnManagerEnabled = columnManagerEnabled;
        this.enableAdequacy = enableAdequacy;
        this.gender = Number(localStorage.getItem('gender'));
        this.currentView = 'default';
        this.isAdequacyHighlighted = false;
        if (Array.isArray(headersConfig)) {
            this.headersConfig = { default: headersConfig }; this.views = [];
            this.views = ['default'];
            this.currentView = 'default';
        } else {
            this.headersConfig = headersConfig;
            this.views = Object.keys(headersConfig);
            this.currentView = this.views[0];
        }


        console.clear()

        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Container with id '${containerId}' not found. Please ensure it exists in the DOM.`);
        }

        this.initialize().catch((error) => console.error('Initialization failed:', error));
    }

    async initialize() {
        await this.loadHtmlTemplate();
        await this.loadTable();
        this.setupEventListeners();
    }

    async loadHtmlTemplate() {
        try {
            const response = await fetch('/components/table.html');
            if (!response.ok) {
                throw new Error('Failed to fetch table.html');
            }
            const html = await response.text();
            this.container.innerHTML = html;

            this.tableBody = this.container.querySelector('#tableBody');
            this.tableHeaders = this.container.querySelector('#tableHeaders');
            this.setColumnsBtn = this.container.querySelector('#setColumnsBtn');

            this.tableHeaders.innerHTML = this.getTableHeaders();

            this.tableSorter = new TableSorter({
                tableHeaders: this.tableHeaders,
                tableBody: this.tableBody,
                headersConfig: this.headersConfig[this.currentView] || this.headersConfig['default']
            });

            if (this.columnManagerEnabled) {
                this.columnManager = new ColumnManager({
                    module: this.containerId,
                    view: this.currentView,
                    tableHeaders: this.tableHeaders,
                    tableBody: this.tableBody,
                });
            }


            if (this.views.length > 1) {
                this.generateViewButtons();
            }

            if (this.enableAdequacy) {
                this.generateAdequacyControls();
            }

            if (this.exportEnabled) {
                this.generateExportControls();
            }


            if (!this.tableBody || !this.tableHeaders) {
                throw new Error('Table body or table headers not found in the HTML template');
            }
        } catch (error) {
            console.error('Failed to load HTML template:', error);
        }
    }

    async loadTable() {
        try {
            const response = await this.api.fetchAll();
            //console.log(response)
            if (response.length === 0) {
                this.tableBody.innerHTML = `<tr><td colspan="${this.headersConfig.length}" class="text-center">No items to display.</td></tr>`;
                return;
            }

            if (this.enableAdequacy) {
                response.forEach(item => {
                    if (item.rankAdequacy === undefined) {
                        item.rankAdequacy = checkRankAdequacy(item);
                    }
                });
            }

            this.tableBody.innerHTML = response.map((item, index) => this.renderTableRow(item, index)).join('');
            updateTableRowIds(this.tableBody);

            if (this.columnManagerEnabled && this.columnManager) {
                this.columnManager.applyColumnPreferences();
            }

        } catch (error) {
            showToast('Failed to load data.', 'danger');
        }
    }

    async reloadTable() {
        try {
            await this.loadTable();
        } catch (error) {
            console.error('Failed to reload table:', error);
        }
    }

    getTableHeaders() {
        const headers = this.headersConfig[this.currentView] || this.headersConfig['default'];
        //console.log(headers)
        return headers.map(header => `
            <th data-key="${header.key || ''}">
                ${header.label}
            </th>`).join('');
    }

    renderTableRow(item) {
        // const headers = this.currentView === 'all'
        //     ? Object.values(this.headersConfig).flat()
        //     : this.headersConfig[this.currentView] || this.headersConfig;
        const headers = this.headersConfig[this.currentView] || this.headersConfig['default'];

        const rowCells = headers.filter(col => col.key).map(col => {
            const value = item[col.key];
            const formattedValue = value !== undefined && value !== null
                ? (col.formatter ? col.formatter(value, this.gender) : value)
                : '-';
            return `<td>${formattedValue}</td>`;
        }).join('');

        return `
            <tr>
                <td class="dynamic-id"></td>
                ${rowCells}
                <td>
                    <button class="btn btn-secondary btn-sm editItemBtn" data-id="${item.id}">Edit</button>
                    <button class="btn btn-danger btn-sm deleteItemBtn" data-id="${item.id}">Delete</button>
                </td>
            </tr>`;
    }

    generateViewButtons() {
        const tableControls = this.container.querySelector('.table-controls');

        const viewButtonsContainer = document.createElement('div');
        viewButtonsContainer.classList.add('btn-group', 'view-buttons-group');
        viewButtonsContainer.setAttribute('role', 'group');
        viewButtonsContainer.setAttribute('aria-label', 'View options');

        this.views.forEach(view => {
            const button = document.createElement('button');
            button.classList.add('btn', 'btn-outline-primary', 'view-btn');
            button.dataset.view = view;
            button.id = `view${view.charAt(0).toUpperCase() + view.slice(1)}`;
            button.textContent = view.charAt(0).toUpperCase() + view.slice(1);

            button.addEventListener('click', async () => {
                this.currentView = view;
                this.updateActiveViewButton(view);
                this.tableHeaders.innerHTML = this.getTableHeaders();
                await this.reloadTable();
                this.tableSorter = new TableSorter({
                    tableHeaders: this.tableHeaders,
                    tableBody: this.tableBody,
                    headersConfig: this.headersConfig[this.currentView] || this.headersConfig['default']
                });

                if (this.columnManagerEnabled) {
                    this.columnManager = new ColumnManager({
                        module: this.containerId,
                        view: this.currentView,
                        tableHeaders: this.tableHeaders,
                        tableBody: this.tableBody,
                    });
                    this.columnManager.applyColumnPreferences(); // Zastosowanie preferencji kolumn
                }
            });
            viewButtonsContainer.appendChild(button);
        });

        tableControls.prepend(viewButtonsContainer);
        this.updateActiveViewButton(this.currentView);
    }

    generateAdequacyControls() {
        const tableControls = this.container.querySelector('.table-controls');

        // Create container for adequacy controls
        const adequacyControlsContainer = document.createElement('div');
        adequacyControlsContainer.classList.add('adequacy-controls', 'd-flex', 'align-items-center');

        // Info Icon Container
        const infoIconContainer = document.createElement('div');
        infoIconContainer.classList.add('info-icon-container', 'me-2');
        infoIconContainer.innerHTML = `
            <span class="info-icon" id="adequacyInfoIcon">i</span>
        `;
        adequacyControlsContainer.appendChild(infoIconContainer);

        // Toggle Adequacy Button
        const toggleAdequacyBtn = document.createElement('button');
        toggleAdequacyBtn.classList.add('btn', 'btn-outline-secondary', 'ms-2');
        toggleAdequacyBtn.id = 'toggleAdequacyBtn';
        toggleAdequacyBtn.textContent = 'Toggle Adequacy';
        adequacyControlsContainer.appendChild(toggleAdequacyBtn);

        tableControls.prepend(adequacyControlsContainer);

        this.infoIcon = infoIconContainer.querySelector('#adequacyInfoIcon');
        this.toggleAdequacyBtn = toggleAdequacyBtn;
    }


    generateExportControls() {
        const tableControls = this.container.querySelector('.table-controls');

        // Select for export views (only if multiple views exist)
        if (this.views && this.views.length > 1) {
            const exportViewSelect = document.createElement('select');
            exportViewSelect.id = 'exportViewSelect';
            exportViewSelect.classList.add('form-select', 'me-2');

            const allDataOption = document.createElement('option');
            allDataOption.value = 'all';
            allDataOption.textContent = 'All Data';
            exportViewSelect.appendChild(allDataOption);

            this.views.forEach(view => {
                const option = document.createElement('option');
                option.value = view;
                option.textContent = view.charAt(0).toUpperCase() + view.slice(1);
                exportViewSelect.appendChild(option);
            });

            tableControls.appendChild(exportViewSelect);
        }

        ['json', 'csv', 'excel'].forEach(format => {
            const button = document.createElement('button');
            button.classList.add('btn', 'btn-secondary', 'me-2');
            button.id = `export${format.charAt(0).toUpperCase() + format.slice(1)}Btn`;
            button.textContent = `Export to ${format.toUpperCase()}`;
            tableControls.appendChild(button);
        });
    }

    updateActiveViewButton(view) {
        document.querySelectorAll('.view-btn').forEach((btn) => {
            btn.classList.remove('active');
        });

        const activeBtn = document.getElementById(`view${view.charAt(0).toUpperCase() + view.slice(1)}`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        } else {
            showToast(`No button found for current view: ${view}`, 'warning');
        }
    }

    toggleAdequacyColors() {
        const rows = document.querySelectorAll('#tableBody tr');
        this.isAdequacyHighlighted = !this.isAdequacyHighlighted;
        rows.forEach(row => {
            row.classList.remove('row-green', 'row-light-green', 'row-red');
            if (this.isAdequacyHighlighted) {
                const rankAdequacy = row.getAttribute('data-rank-adequacy');
                if (rankAdequacy) {
                    row.classList.add(`row-${rankAdequacy}`);
                }
            }
        });
    }

    setupEventListeners() {
        this.tableBody.addEventListener('click', async (event) => {
            const target = event.target;
            const itemId = target.dataset.id;

            if (target.classList.contains('editItemBtn')) {
                await this.onEdit(itemId);
            } else if (target.classList.contains('deleteItemBtn')) {
                await this.onDelete(itemId);
            }
        });

        if (this.exportEnabled) {
            const jsonBtn = document.getElementById('exportJsonBtn');
            const csvBtn = document.getElementById('exportCsvBtn');
            const excelBtn = document.getElementById('exportExcelBtn');

            if (jsonBtn) jsonBtn.addEventListener('click', () => this.exportTable('json'));
            if (csvBtn) csvBtn.addEventListener('click', () => this.exportTable('csv'));
            if (excelBtn) excelBtn.addEventListener('click', () => this.exportTable('excel'));
        }

        if (this.columnManagerEnabled && this.setColumnsBtn) {
            this.setColumnsBtn.addEventListener('click', () => {
                const headers = this.headersConfig[this.currentView] || this.headersConfig['default'] || this.headersConfig;
                const columns = Array.isArray(headers)
                    ? headers.map(header => header.label)
                    : [];

                this.columnManager.showColumnManagerModal();
            });
        }


        if (this.enableAdequacy && this.toggleAdequacyBtn) {
            this.toggleAdequacyBtn.addEventListener('click', () => this.toggleAdequacyColors());
        }


        const searchInput = this.container.querySelector('#searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce((e) => this.filterTable(e.target.value), 300));
        }
    }

    filterTable(searchText) {
        const rows = Array.from(this.tableBody.querySelectorAll('tr'));
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchText.toLowerCase()) ? '' : 'none';
        });
    }

    debounce(func, delay) {
        let debounceTimer;
        return function () {
            const context = this;
            const args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(context, args), delay);
        };
    }

    exportTable(format) {
        const headers = this.headersConfig[this.currentView] || this.headersConfig['default'];
        const exportableHeaders = headers.filter(header => header.exportable !== false);

        const items = Array.from(this.tableBody.querySelectorAll('tr')).map((row, index) => {
            const cells = row.querySelectorAll('td');
            const itemData = {};

            exportableHeaders.forEach((header, colIndex) => {
                itemData[header.label] = cells[colIndex]?.textContent?.trim() || '-';
            });

            return itemData;
        });

        const filename = `export.${format === 'excel' ? 'xlsx' : format}`;

        if (format === 'json') {
            const dataStr = JSON.stringify(items, null, 2);
            this.downloadFile(dataStr, filename, 'application/json');
        } else if (format === 'csv') {
            const dataStr = this.convertToCsv(items, exportableHeaders);
            this.downloadFile(dataStr, filename, 'text/csv');
        } else if (format === 'excel') {
            this.exportToExcel(items, exportableHeaders, filename);
        }
    }


    exportToExcel(data, headers, filename) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Data Export');

        // Dodanie nagłówków
        worksheet.addRow(headers.map(header => header.label));

        // Dodanie danych
        data.forEach(item => {
            worksheet.addRow(headers.map(header => item[header.label] || '-'));
        });

        workbook.xlsx.writeBuffer().then(buffer => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
        });
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }

    convertToCsv(items, headers) {
        const headerRow = headers.map(header => header.label).join(',');
        const rows = items.map(item => headers.map(header => item[header.label] || '-').join(','));
        return [headerRow, ...rows].join('\n');
    }

}

export default TableComponent;
