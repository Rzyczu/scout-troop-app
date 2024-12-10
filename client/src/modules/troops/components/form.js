import troopsApi from './api.js';
import { showToast, showConfirmationModal } from '../../../utils/ui.js';
import { createSelectPopulator } from '../../../utils/selectFactory';

export const populateLeaderSelect = createSelectPopulator({
    valueField: 'user_id',
    textField: (item) => `${item.name} ${item.surname}`,
    addNone: true,
});

export const resetForm = async (form, modalLabel, fieldsToClear, selectLeaderFieldId) => {
    form.reset();
    form.dataset.id = '';

    fieldsToClear.forEach((fieldId) => {
        const field = document.getElementById(fieldId);
        if (field) field.value = '';
    });

    try {
        const response = await troopsApi.fetchMembers();
        console.log('Members data:', response.members);
        const members = Array.isArray(response.members) ? response.members : Object.values(response.members);
        await populateLeaderSelect(selectLeaderFieldId, members);
    } catch (error) {
        showToast(error.message || 'Failed to load leaders.', 'danger');
    }

    modalLabel.textContent = 'Add Troop';
};

export const handleFormSubmit = async (form, modal, loadTroops) => {
    const formData = new FormData(form);
    const troopId = formData.get('troopId');
    const troopName = formData.get('troopName');
    const leaderId = formData.get('troopLeader');


    const payload = {
        name: troopName,
        leaderId: leaderId || null,
    };

    console.log(payload)

    try {
        if (troopId) {
            // Edycja istniejącego oddziału
            await troopsApi.update(troopId, payload);
            showToast('Troop updated successfully!', 'success');
        } else {
            // Tworzenie nowego oddziału
            await troopsApi.create(payload);
            showToast('Troop added successfully!', 'success');
        }
        modal.hide();
        await loadTroops();
    } catch (error) {
        showToast(error.message || 'Failed to save troop.', 'danger');
    }
};

export const handleEditTroop = async (target, modalLabel, modal) => {
    const troopId = target.dataset.id;
    console.log(troopId)

    try {
        const troop = await troopsApi.fetchById(troopId);
        if (!troop) throw new Error('Troop not found.');

        // Fetch members and populate the troopLeader dropdown
        const response = await troopsApi.fetchMembers();
        const members = Array.isArray(response.members) ? response.members : Object.values(response.members);
        await populateLeaderSelect('troopLeader', members, troop.leader ? troop.leader.id : null);

        Object.entries({
            troopName: troop.name,
            troopLeader: troop.leader.id || '0',
            troopId: troop.id,
        }).forEach(([key, value]) => {
            const field = document.getElementById(key);
            if (field) field.value = value;
        });

        modalLabel.textContent = 'Edit Troop';
        modal.show();
    } catch (error) {
        showToast(error.message || 'Failed to load troop data.', 'danger');
    }
};

export const handleDeleteTroop = async (target, loadTroops) => {
    const troopId = target.dataset.id;

    try {
        const confirmed = await showConfirmationModal(
            'Delete Troop',
            'Are you sure you want to delete this troop? This action cannot be undone.'
        );

        if (confirmed) {
            await troopsApi.delete(troopId);
            showToast('Troop deleted successfully!', 'success');
            await loadTroops();
        }
    } catch (error) {
        showToast(error.message || 'Failed to delete troop.', 'danger');
    }
};
