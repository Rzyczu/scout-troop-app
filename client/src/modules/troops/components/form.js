import troopsApi from './api.js';
import { showToast, showConfirmationModal } from '../../../utils/ui.js';

export const populateLeaderSelect = async (selectFieldId, selectedValue = null) => {
    try {
        const response = await troopsApi.fetchMembers();
        const members = response.members;
        const selectField = document.getElementById(selectFieldId);
        selectField.innerHTML = '<option value="">Select a leader</option>';

        members.forEach((member) => {
            const option = document.createElement('option');
            option.value = member.user_id;
            option.textContent = `${member.name} ${member.surname}`;
            if (selectedValue && member.user_id === selectedValue) {
                option.selected = true;
            }
            selectField.appendChild(option);
        });
    } catch (error) {
        showToast(error.message || 'Failed to load leaders.', 'danger');
    }
};

export const resetForm = async (form, modalLabel, fieldsToClear, selectLeaderFieldId) => {
    form.reset();
    form.dataset.id = ''; // Clear troop ID for create mode
    fieldsToClear.forEach((fieldId) => {
        const field = document.getElementById(fieldId);
        if (field) field.value = '';
    });

    await populateLeaderSelect(selectLeaderFieldId);
    document.getElementById(selectLeaderFieldId).value = '';


    modalLabel.textContent = 'Add Troop';
};

export const handleFormSubmit = async (form, modal, loadTroops) => {
    const formData = new FormData(form);
    const troopId = form.dataset.id;
    const leaderId = formData.get('troopLeader');

    const payload = {
        name: formData.get('troopName'),
        leaderId: leaderId || null,
    };

    console.log(payload)
    console.log(troopId)

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

export const handleEditTroop = async (target, form, modalLabel, modal) => {
    const troopId = target.dataset.id;

    try {
        const troop = await troopsApi.fetchById(troopId);
        if (!troop) throw new Error('Troop not found.');

        form.dataset.id = troop.id;
        document.getElementById('troopName').value = troop.name;

        await populateLeaderSelect('troopLeader', troop.leader.id);
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
