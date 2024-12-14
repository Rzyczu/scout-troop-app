import troopsApi from './api.js';
import { showToast } from '../../../utils/ui.js';
import { updateTableRowIds } from '../../../utils/tableUtils.js';
import headersConfig from '../config/headers.js';

export const loadTroops = async (tableBody) => {
    try {
        const troopsTableHeader = document.getElementById('tableHeaders');
        const troops = await troopsApi.fetchAll();

        if (troops.length === 0) {
            showToast('No troops available.', 'warning');
            tableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center">No troops to display. Add a troop to get started.</td>
                </tr>
            `;
            return;
        };

        const tableHeaders = getTableHeaders();
        troopsTableHeader.innerHTML = tableHeaders;
        tableBody.innerHTML = renderTableRows(troops);
        updateTableRowIds(tableBody);
    } catch (error) {
        showToast(error.message || 'Failed to load troops.', 'danger');
    }
};

export const renderTableRows = (troops) => {
    return troops.map((troop) => {
        const rowCells = headersConfig
            .filter(header => header.key)
            .map(header => {
                const value = troop[header.key] || '-';
                return `<td>${header.formatter ? header.formatter(value) : value}</td>`;
            })
            .join('');

        return `
        <tr>
            <td class="dynamic-id"></td>
            ${rowCells}
            <td>
                <button class="btn btn-secondary btn-sm editTroopBtn" data-id="${troop.id}">Edit</button>
                <button class="btn btn-danger btn-sm deleteTroopBtn" data-id="${troop.id}">Delete</button>
            </td>
        </tr>
        `;
    }).join('');
};


export const getTableHeaders = () => {
    return headersConfig.map(header =>
        `<th>${header.label}</th>`
    ).join('');
};
