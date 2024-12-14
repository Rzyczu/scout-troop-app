import troopsApi from './api.js';
import { showToast } from '../../../utils/ui.js';
import { updateTableRowIds } from '../../../utils/tableUtils.js';
import headersConfig from '../config/headers.js';

export const loadTroops = async (tableBody) => {
    try {
        const troopsTableHeader = document.querySelector('thead');
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

        const tableHeaders = getTableHeaders(headersConfig);
        troopsTableHeader.innerHTML = `<tr>${tableHeaders}</tr>`;
        tableBody.innerHTML = renderTableRows(troops);
        updateTableRowIds(tableBody);
    } catch (error) {
        showToast(error.message || 'Failed to load troops.', 'danger');
    }
};

export const renderTableRows = (troops) => {
    return troops
        .map((troop, index) => renderTableRow(troop, index))
        .join('');
};

export const renderTableRow = (troop, index) => {
    return `
        <tr>
            <td class="dynamic-id"></td>
            <td>${troop.name}</td>
            <td>${troop.leader ? `${troop.leader.name} ${troop.leader.surname}` : '-'}</td>
            <td>
                <button class="btn btn-secondary btn-sm editTroopBtn" data-id="${troop.id}">Edit</button>
                <button class="btn btn-danger btn-sm deleteTroopBtn" data-id="${troop.id}">Delete</button>
            </td>
        </tr>
    `;
};

export const getTableHeaders = (headersConfig) => {
    return headersConfig.map(header =>
        `<th class="${header.sortable ? 'sortable' : ''}">${header.label}</th>`
    ).join('');
};