import troopsApi from './api.js';
import { showToast } from '../../../utils/ui.js';

export const loadTroops = async (tableBody) => {
    try {
        const troops = await troopsApi.fetchAll();

        if (troops.length === 0) {
            // Jeśli brak zastępów, wyświetl ostrzeżenie i komunikat w tabeli
            showToast('No troops available.', 'warning');
            tableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center">No troops to display. Add a troop to get started.</td>
                </tr>
            `;
            return;
        };

        console.log(troops)

        tableBody.innerHTML = troops.map((troop, index) =>
            `<tr>
                <td>${index + 1}</td>
                <td>${troop.name}</td>
                <td>${troop.leader ? `${troop.leader.name} ${troop.leader.surname}` : '-'}</td>
                <td>
                    <button class="btn btn-secondary btn-sm editTroopBtn" data-id="${troop.id}">Edit</button>
                    <button class="btn btn-danger btn-sm deleteTroopBtn" data-id="${troop.id}">Delete</button>
                </td>
            </tr>`
        ).join('');
    } catch (error) {
        showToast(error.message || 'Failed to load troops.', 'danger');
    }
};

export const renderTableRows = (troops) => {
    return troops
        .map((troop, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${troop.name}</td>
                <td>${troop.leader ? `${troop.leader.name} ${troop.leader.surname}` : '-'}</td>
                <td>
                    <button class="btn btn-secondary btn-sm editTroopBtn" data-id="${troop.id}">Edit</button>
                    <button class="btn btn-danger btn-sm deleteTroopBtn" data-id="${troop.id}">Delete</button>
                </td>
            </tr>
        `)
        .join('');
};