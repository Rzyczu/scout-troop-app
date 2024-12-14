import { updateTableRowIds } from './tableUtils.js';

export const saveColumnPreferences = (module, view, preferences) => {
    const key = `${module}_table_columns`;
    const existingPreferences = JSON.parse(localStorage.getItem(key)) || {};
    existingPreferences[view] = preferences;
    localStorage.setItem(key, JSON.stringify(existingPreferences));
};

export const getColumnPreferences = (module, view) => {
    const key = `${module}_table_columns`;
    const preferences = JSON.parse(localStorage.getItem(key)) || {};
    return preferences[view] || null;
};

export const applyColumnPreferences = (module, view, tableHeaders, tableBody) => {
    const preferences = getColumnPreferences(module, view);
    if (!preferences) return;

    preferences.columns.forEach((colName, index) => {
        const th = tableHeaders.querySelectorAll('th.sortable')[index];
        const tds = tableBody.querySelectorAll(`td:nth-child(${index + 2})`);
        if (!th) return;
        const isVisible = preferences.visibility[colName];

        th.style.display = isVisible ? '' : 'none';
        tds.forEach(td => td.style.display = isVisible ? '' : 'none');
    });

    updateTableRowIds(tableBody);
};

export const resetColumnPreferences = (module, view, tableHeaders, tableBody) => {
    const key = `${module}_table_columns`;
    const preferences = JSON.parse(localStorage.getItem(key)) || {};
    if (preferences[view]) {
        delete preferences[view];
        localStorage.setItem(key, JSON.stringify(preferences));
    }

    // Reset widoczności kolumn do stanu początkowego
    const ths = Array.from(tableHeaders.querySelectorAll('th.sortable')).filter(th => th.textContent !== 'ID');
    const rows = tableBody.querySelectorAll('tr');
    ths.forEach(th => th.style.display = '');
    rows.forEach(row => {
        const tds = row.querySelectorAll('td');
        tds.forEach(td => td.style.display = '');
    });
};


export const showColumnManagerModal = (module, view, columns, tableHeaders, tableBody) => {
    const preferences = getColumnPreferences(module, view) || { columns, visibility: {} };
    const filteredColumns = columns.map(col => col.replace(/[\u2B07\u2B06]/g, '')).filter(col => col.toLowerCase() !== 'actions' && col.toLowerCase() !== 'id');
    const modal = document.createElement('div');
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
                        <tbody id="columnCheckboxList">
                            ${filteredColumns.map(col => `
                                <tr class="draggable-item" draggable="true">
                                    <td>${col}</td>
                                    <td class="text-center">
                                        <label class="switch">
                                            <input type="checkbox" id="col_${col}" data-column="${col}" ${preferences.visibility[col] !== false ? 'checked' : ''}>
                                            <span class="slider round"></span>
                                        </label>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
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
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();

    const columnList = document.getElementById('columnCheckboxList');

    let draggedItem = null;

    document.querySelectorAll('.draggable-item').forEach(item => {
        item.addEventListener('dragstart', (e) => {
            draggedItem = item;
            setTimeout(() => item.classList.add('hidden'), 0); // Dodaj klasę ukrywania
        });

        item.addEventListener('dragend', () => {
            draggedItem.classList.remove('hidden');
            draggedItem = null;
        });

        item.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        item.addEventListener('drop', (e) => {
            e.preventDefault();
            if (item !== draggedItem && draggedItem && item.parentElement === columnList) {
                const allItems = Array.from(columnList.querySelectorAll('.draggable-item'));
                const dropIndex = allItems.indexOf(item);
                columnList.insertBefore(draggedItem, dropIndex > allItems.indexOf(draggedItem) ? item.nextSibling : item);
            }
        });
    });

    document.getElementById('saveColumnChanges').addEventListener('click', () => {
        const preferences = { columns: [], visibility: {} };
        const draggableItems = document.querySelectorAll('#columnCheckboxList .draggable-item');
        draggableItems.forEach(item => {
            const checkbox = item.querySelector('input[type="checkbox"]');
            const columnName = checkbox.getAttribute('data-column');
            preferences.columns.push(columnName);
            preferences.visibility[columnName] = checkbox.checked;
        });

        saveColumnPreferences(module, view, preferences);
        applyColumnPreferences(module, view, tableHeaders, tableBody);
        modalInstance.hide();
        modal.remove();
    });

    document.getElementById('resetColumnsBtn').addEventListener('click', () => {
        resetColumnPreferences(module, view, tableHeaders, tableBody);
        const draggableItems = document.querySelectorAll('#columnCheckboxList .draggable-item');
        draggableItems.forEach(item => {
            const checkbox = item.querySelector('input[type="checkbox"]');
            checkbox.checked = true;
        });
        modalInstance.hide();
        modal.remove();
    });
};
