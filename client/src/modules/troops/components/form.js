import { troopsApi } from './api.js';
import { showToast, showConfirmationModal } from '../../../utils/ui.js';

export const resetForm = async (form, modalLabel, leaderSelect) => {
    form.reset();
    modalLabel.textContent = 'Add Troop';
    leaderSelect.innerHTML = '<option value="">Select a leader</option>';
    try {
        const leaders = await troopsApi.fetchLeaders();
        leaders.forEach((leader) => {
            const option = document.createElement('option');
            option.value = leader.id;
            option.textContent = `${leader.name} ${leader.surname}`;
            leaderSelect.appendChild(option);
        });
    } catch (error) {
        showToast(error.message || 'Failed to load leaders.', 'danger');
    }
};

export const handleFormSubmit = async (form, modal, reloadTroops) => {
    const formData = new FormData(form);
    const payload = {
        name: formData.get('name'),
        leaderId: formData.get('leader'),
    };

    try {
        if (form.dataset.id) {
            await troopsApi.update(form.dataset.id, payload);
            showToast('Troop updated successfully!', 'success');
        } else {
            await troopsApi.create(payload);
            showToast('Troop added successfully!', 'success');
        }
        modal.hide();
        reloadTroops();
    } catch (error) {
        showToast(error.message || 'Failed to save troop.', 'danger');
    }
};

export const handleEditTroop = async (troopId, form, modal, modalLabel) => {
    try {
        const troop = await troopsApi.fetchById(troopId);
        if (!troop) throw new Error('Troop not found.');

        form.dataset.id = troop.id;
        form.name.value = troop.name;
        form.leader.value = troop.leaderId || '';
        modalLabel.textContent = 'Edit Troop';
        modal.show();
    } catch (error) {
        showToast(error.message || 'Failed to load troop data.', 'danger');
    }
};
