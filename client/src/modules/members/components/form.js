import membersApi from './api.js';
import { showToast, showConfirmationModal } from '../../../utils/ui.js';

export const resetForm = (form, modalLabel, fieldsToClear, selectFieldsToClear) => {
    form.reset();
    fieldsToClear.forEach((fieldId) => {
        const field = document.getElementById(fieldId);
        if (field) field.value = '';
    });

    selectFieldsToClear.forEach((fieldId) => {
        const field = document.getElementById(fieldId);
        if (field) field.value = 0;
    });
    modalLabel.textContent = 'Add Member';
};

export const handleFormSubmit = async (form, modal, reloadMembers) => {
    const formData = new FormData(form);
    const troopIdValue = formData.get('troopSelect');

    const payload = {
        user_id: formData.get('userId'),
        user: {
            name: formData.get('name'),
            surname: formData.get('surname'),
            date_birth: formData.get('dateBirth'),
        },
        contact: {
            phone_number: formData.get('phoneNumber'),
            mother_phone_number: formData.get('motherPhoneNumber'),
            father_phone_number: formData.get('fatherPhoneNumber'),
            parent_email_1: formData.get('parentEmail1'),
            parent_email_2: formData.get('parentEmail2'),
        },
        scout: {
            function: formData.get('scoutFunction'),
            open_rank: formData.get('openRank'),
            achieved_rank: formData.get('achievedRank'),
            instructor_rank: formData.get('instructorRank'),
            troop_id: formData.get('troopSelect') === '0' ? null : formData.get('troopSelect'),
        },
    };
    console.log(payload)
    try {
        if (payload.user_id) {
            // Aktualizacja członka
            await membersApi.update(payload.user_id, payload);
            showToast('Member updated successfully.', 'success');
        } else {
            // Tworzenie nowego członka
            await membersApi.create(payload);
            showToast('Member added successfully.', 'success');
        }
        modal.hide();
        await reloadMembers();
    } catch (error) {
        showToast(error.message || 'Failed to save member.', 'danger');
    }
};

export const handleEditMember = async (target, modalLabel, modal) => {
    const memberId = target.dataset.id;

    try {
        const member = await membersApi.fetchById(memberId);
        if (!member) throw new Error('Member not found.');

        Object.entries({
            name: member.name,
            surname: member.surname,
            dateBirth: new Date(member.date_birth).toISOString().split('T')[0],
            phoneNumber: member.phone_number || '',
            motherPhoneNumber: member.mother_phone_number || '',
            fatherPhoneNumber: member.father_phone_number || '',
            parentEmail1: member.parent_email_1 || '',
            parentEmail2: member.parent_email_2 || '',
            scoutFunction: member.function || '0',
            openRank: member.open_rank || '0',
            achievedRank: member.achieved_rank || '0',
            instructorRank: member.instructor_rank || '0',
            troopSelect: member.troop_id || '0',
            userId: memberId,
        }).forEach(([key, value]) => {
            const field = document.getElementById(key);
            if (field) field.value = value;
        });

        modalLabel.textContent = 'Edit Member';
        modal.show();
    } catch (error) {
        showToast(error.message || 'Failed to fetch member data.', 'danger');
    }
};

export const handleDeleteMember = async (target, reloadMembers) => {
    const memberId = target.dataset.id;

    try {
        const confirmed = await showConfirmationModal(
            'Delete Member',
            'Are you sure you want to delete this member? This action cannot be undone.'
        );

        if (confirmed) {
            await membersApi.delete(memberId);
            showToast('Member deleted successfully.', 'success');
            await reloadMembers();
        }
    } catch (error) {
        showToast(error.message || 'Failed to delete member.', 'danger');
    }
};
