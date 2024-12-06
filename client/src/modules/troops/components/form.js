import troopsApi from './api.js';
import { showToast, showConfirmationModal } from '../../../utils/ui.js';

export const resetForm = async (form, modalLabel, leaderSelect) => {
    form.reset();
    form.dataset.id = ''; // Clear troop ID for create mode
    modalLabel.textContent = 'Add Troop';

    try {
        const leaders = await troopsApi.fetchLeaders();
        leaderSelect.innerHTML = '<option value="">Select a leader</option>';
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
        await reloadTroops();
    } catch (error) {
        showToast(error.message || 'Failed to save troop.', 'danger');
    }
};

export const handleEditTroop = async (target, form, modalLabel, modal) => {
    const troopId = target.dataset.id;

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

export const handleDeleteTroop = async (target, reloadTroops) => {
    const troopId = target.dataset.id;

    try {
        const confirmed = await showConfirmationModal(
            'Delete Troop',
            'Are you sure you want to delete this troop? This action cannot be undone.'
        );

        if (confirmed) {
            await troopsApi.delete(troopId);
            showToast('Troop deleted successfully!', 'success');
            await reloadTroops();
        }
    } catch (error) {
        showToast(error.message || 'Failed to delete troop.', 'danger');
    }
};
