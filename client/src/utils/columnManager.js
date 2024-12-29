import { updateTableRowIds } from './tableUtils.js';

export default class ColumnManager {
    constructor({ module, view, tableHeaders, tableBody }) {
        this.module = module;
        this.view = view;
        this.tableHeaders = tableHeaders;
        this.tableBody = tableBody;
        this.preferences = this.getColumnPreferences() || this.getDefaultPreferences();
    }

    getColumnPreferences() {
        const key = `${this.module}_table_columns`;
        const preferences = JSON.parse(localStorage.getItem(key)) || {};
        const viewPreferences = preferences[this.view];

        // Jeśli brak preferencji, zwracamy domyślne
        if (!viewPreferences) {
            return this.getDefaultPreferences();
        }

        // Konwersja na tablicę w razie potrzeby
        return Array.isArray(viewPreferences) ? viewPreferences : this.convertPreferencesToArray(viewPreferences);
    }

    convertPreferencesToArray(preferences) {
        return Object.keys(preferences.visibility).map(column => ({
            column,
            visible: preferences.visibility[column]
        }));
    }


    getDefaultPreferences() {
        const headers = Array.from(this.tableHeaders.querySelectorAll('th.sortable'));
        return headers.map(th => ({
            column: th.textContent.trim(),
            visible: true
        }));
    }

    loadPreferencesFromJSON(jsonData) {
        this.module = jsonData.module.module || this.module;
        this.view = jsonData.module.view || this.view;
        this.tableHeaders = document.querySelector(jsonData.module.tableHeaders) || this.tableHeaders;
        this.tableBody = document.querySelector(jsonData.module.tableBody) || this.tableBody;
        this.preferences = jsonData.preferences || this.preferences;

        // Apply the preferences to the table
        this.applyColumnPreferences();
    }

    saveColumnPreferences() {
        const key = `${this.module}_table_columns`;
        const existingPreferences = JSON.parse(localStorage.getItem(key)) || {};
        existingPreferences[this.view] = this.preferences;
        localStorage.setItem(key, JSON.stringify(existingPreferences));
    }

    applyColumnPreferences() {
        this.preferences.forEach((preference, index) => {
            const th = this.tableHeaders.querySelectorAll('th.sortable')[index];
            const tds = this.tableBody.querySelectorAll(`td:nth-child(${index + 2})`);
            if (!th) return;

            const isVisible = preference.visible;
            th.style.display = isVisible ? '' : 'none';
            tds.forEach(td => td.style.display = isVisible ? '' : 'none');
        });

        updateTableRowIds(this.tableBody);
    }

    resetColumnPreferences() {
        const key = `${this.module}_table_columns`;
        const preferences = JSON.parse(localStorage.getItem(key)) || {};
        if (preferences[this.view]) {
            delete preferences[this.view];
            localStorage.setItem(key, JSON.stringify(preferences));
        }

        // Reset visibility to default (all visible)
        this.preferences = this.getDefaultPreferences();
        this.saveColumnPreferences();
        this.applyColumnPreferences();
    }

    showColumnManagerModal() {
        let modal = document.getElementById('columnManagerModal');

        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'modal fade';
            modal.id = 'columnManagerModal';
            modal.innerHTML = `
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Manage Columns</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <table class="table table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <th>Column</th>
                                        <th>Visible</th>
                                    </tr>
                                </thead>
                                <tbody id="columnCheckboxList"></tbody>
                            </table>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-warning" id="resetColumnsBtn">Reset to Default</button>
                            <button type="button" class="btn btn-primary" id="saveColumnChanges">Save Changes</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();

        const columnList = document.getElementById('columnCheckboxList');
        columnList.innerHTML = '';

        this.preferences.forEach((preference, index) => {
            const uniqueId = `col_${preference.column.replace(/\s+/g, '_')}_${Math.random().toString(36).substr(2, 5)}`;
            const row = document.createElement('tr');
            row.classList.add('draggable-item');
            row.setAttribute('draggable', 'true');

            row.innerHTML = `
                <td>${preference.column}</td>
                <td class="text-center">
                    <label class="switch">
                        <input type="checkbox" id="${uniqueId}" data-column="${preference.column}" ${preference.visible ? 'checked' : ''}>
                        <span class="slider round"></span>
                    </label>
                </td>
            `;
            columnList.appendChild(row);
        });

        document.getElementById('saveColumnChanges').addEventListener('click', () => {
            const preferences = [];
            const draggableItems = document.querySelectorAll('#columnCheckboxList .draggable-item');
            draggableItems.forEach(item => {
                const checkbox = item.querySelector('input[type="checkbox"]');
                const columnName = checkbox.getAttribute('data-column');
                preferences.push({
                    column: columnName,
                    visible: checkbox.checked
                });
            });

            this.preferences = preferences;
            this.saveColumnPreferences();
            this.applyColumnPreferences();
            modalInstance.hide();
        });

        document.getElementById('resetColumnsBtn').addEventListener('click', () => {
            this.resetColumnPreferences();
            modalInstance.hide();
        });
    }

    updateView(view) {
        this.view = view;
        this.preferences = this.getColumnPreferences() || this.getDefaultPreferences();
        this.applyColumnPreferences();
    }
}
