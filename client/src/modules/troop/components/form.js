import troopApi from './api.js';
import { showToast } from '../../../utils/ui.js';
import { populateSelect } from '../../../utils/helpers.js';

export const handleEditTroopFormSubmit = async (form, troopId) => {
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = form.querySelector('#troopNameInput').value;
        const description = form.querySelector('#troopDescriptionInput').value;

        try {
            await troopApi.updateTroop(troopId, { name, description });
            showToast('Troop updated successfully.', 'success');
            location.reload();
        } catch (error) {
            showToast(error.message || 'Failed to update troop.', 'danger');
        }
    });
};

export const handleAddUserFormSubmit = async (form, troopId, reloadUsers) => {
    const userSelect = form.querySelector('#userSelect');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const userId = userSelect.value;
        if (!userId) {
            showToast('Please select a user.', 'warning');
            return;
        }

        try {
            await troopApi.addUserToTroop(troopId, userId);
            showToast('User added to troop.', 'success');
            form.reset();
            await reloadUsers();
        } catch (error) {
            showToast(error.message || 'Failed to add user to troop.', 'danger');
        }
    });
};

export const loadAvailableUsers = async (selectElement) => {
    try {
        const users = await troopApi.fetchTroopUsers(null); // Users without troop_id
        populateSelect(selectElement, users.map((user) => ({ value: user.id, label: `${user.name} ${user.surname}` })));
    } catch (error) {
        showToast(error.message || 'Failed to load available users.', 'danger');
    }
};
