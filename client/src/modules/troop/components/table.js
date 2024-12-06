import troopApi from './api.js';
import { showToast } from '../../../utils/ui.js';

export const loadTroopUsers = async (troopId, tableBody) => {
    try {
        const users = await troopApi.fetchTroopUsers(troopId);
        tableBody.innerHTML = users
            .map(
                (user, index) =>
                    `<tr>
                        <td>${index + 1}</td>
                        <td>${user.name} ${user.surname}</td>
                        <td>
                            <button class="btn btn-danger btn-sm removeUserBtn" data-id="${user.id}">Remove</button>
                        </td>
                    </tr>`
            )
            .join('');
    } catch (error) {
        showToast(error.message || 'Failed to load users for this troop.', 'danger');
    }
};

export const attachRemoveUserHandlers = (tableBody, troopId, reloadUsers) => {
    tableBody.addEventListener('click', async (event) => {
        if (event.target.classList.contains('removeUserBtn')) {
            const userId = event.target.dataset.id;
            try {
                await troopApi.removeUserFromTroop(troopId, userId);
                showToast('User removed from troop.', 'success');
                await reloadUsers();
            } catch (error) {
                showToast(error.message || 'Failed to remove user from troop.', 'danger');
            }
        }
    });
};
