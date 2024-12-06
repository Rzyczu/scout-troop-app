import troopsApi from './api.js';
import { showToast } from '../../../utils/ui.js';

export const loadTroops = async (tableBody) => {
    try {
        const troops = await troopsApi.fetchAll();
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