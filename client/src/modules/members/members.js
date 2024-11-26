import './members.scss';
import sortTable from '../../utils/sortTable.js';
import initializeFormValidation from '../../utils/formValidation.js';
import { showConfirmationModal } from '../../utils/ui.js';
import { populateSelect, addSortableClassToHeaders, attachSortingToHeaders } from './utils/helpers.js';
import { filterMembersByView, updateActiveViewButton, getTableHeaders, renderTableRow } from './components/views.js';
import { setupMemberFormValidation } from './components/formValidation.js';
import { exportToJson, exportToCsv } from './components/exports.js';
import { membersApi } from './components/api.js';
import { showToast } from '../../utils/ui.js';

// Global variables
let currentView = 'basic';
const membersTableBody = document.getElementById('membersTableBody');
const tableHeaders = document.getElementById('tableHeaders');
const memberForm = document.getElementById('memberForm');
const memberModal = new bootstrap.Modal(document.getElementById('memberModal'));

// Function: Reset form
const resetForm = () => {
    memberForm.reset();
    document.getElementById('memberModalLabel').textContent = 'Add Member';
    document.getElementById('userId').value = '';
    ['phoneNumber', 'motherPhoneNumber', 'fatherPhoneNumber', 'parentEmail1', 'parentEmail2', 'scoutFunction', 'openRank', 'achievedRank', 'instructorRank']
        .forEach(id => (document.getElementById(id).value = ''));
};

// Function: Load members and render table
const loadMembers = async () => {
    try {
        const members = await membersApi.fetchAll();

        // Render table headers and body
        tableHeaders.innerHTML = getTableHeaders(currentView);
        addSortableClassToHeaders(tableHeaders);
        attachSortingToHeaders(tableHeaders, membersTableBody, sortTable);

        membersTableBody.innerHTML = members.map((member, index) => renderTableRow(member, index + 1, currentView)).join('');
    } catch (error) {
        showToast(error.message || 'Failed to fetch members.', 'danger');
    }
};

// Event: Handle view changes
document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
        currentView = btn.dataset.view;
        updateActiveViewButton(currentView);
        await loadMembers();
    });
});

// Event: Handle member form submission
memberForm.onsubmit = async function (event) {
    event.preventDefault();
    if (!this.checkValidity()) {
        this.classList.add('was-validated');
        return;
    }

    const formData = new FormData(this);
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
        },
    };

    try {
        if (payload.user_id) {
            await membersApi.update(payload.user_id, payload);
            showToast('Member updated successfully.', 'success');
        } else {
            await membersApi.create(payload);
            showToast('Member added successfully.', 'success');
        }
        memberModal.hide();
        await loadMembers();
    } catch (error) {
        showToast(error.message || 'Failed to save member.', 'danger');
    }
};

// Event: Handle row actions (edit/delete)
membersTableBody.addEventListener('click', async (event) => {
    const target = event.target;

    if (target.classList.contains('editMemberBtn')) {
        const memberId = target.dataset.id;
        try {
            const member = await membersApi.fetchById(memberId);
            if (!member) throw new Error('Member not found.');

            // Populate form fields
            document.getElementById('name').value = member.name;
            document.getElementById('surname').value = member.surname;
            document.getElementById('dateBirth').value = new Date(member.date_birth).toISOString().split('T')[0];
            document.getElementById('phoneNumber').value = member.phone_number || '';
            document.getElementById('motherPhoneNumber').value = member.mother_phone_number || '';
            document.getElementById('fatherPhoneNumber').value = member.father_phone_number || '';
            document.getElementById('parentEmail1').value = member.parent_email_1 || '';
            document.getElementById('parentEmail2').value = member.parent_email_2 || '';
            document.getElementById('scoutFunction').value = member.function || '0';
            document.getElementById('openRank').value = member.open_rank || '0';
            document.getElementById('achievedRank').value = member.achieved_rank || '0';
            document.getElementById('instructorRank').value = member.instructor_rank || '0';
            document.getElementById('userId').value = memberId;

            document.getElementById('memberModalLabel').textContent = 'Edit Member';
            memberModal.show();
        } catch (error) {
            showToast(error.message || 'Failed to fetch member data.', 'danger');
        }
    } else if (target.classList.contains('deleteMemberBtn')) {
        const confirmed = await showConfirmationModal('Delete Member', 'Are you sure you want to delete this member?');
        if (confirmed) {
            try {
                await membersApi.delete(target.dataset.id);
                showToast('Member deleted successfully.', 'success');
                await loadMembers();
            } catch (error) {
                showToast(error.message || 'Failed to delete member.', 'danger');
            }
        }
    }
});

// Event: Handle export buttons
document.getElementById('exportJsonBtn').addEventListener('click', async () => {
    const view = document.getElementById('exportViewSelect').value;
    try {
        const members = await membersApi.fetchAll();
        const filteredMembers = filterMembersByView(members, view, true);
        exportToJson(filteredMembers, view);
    } catch (error) {
        showToast('Failed to export members to JSON.', 'danger');
    }
});

document.getElementById('exportCsvBtn').addEventListener('click', async () => {
    const view = document.getElementById('exportViewSelect').value;
    try {
        const members = await membersApi.fetchAll();
        const filteredMembers = filterMembersByView(members, view);
        exportToCsv(filteredMembers, view);
    } catch (error) {
        showToast('Failed to export members to CSV.', 'danger');
    }
});

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', async () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dateBirth')?.setAttribute('max', today);

    setupMemberFormValidation(initializeFormValidation);
    populateSelect('scoutFunction', ScoutFunctions);
    populateSelect('openRank', ScoutRanks);
    populateSelect('achievedRank', ScoutRanks);
    populateSelect('instructorRank', InstructorRanks);

    updateActiveViewButton(currentView);

    await loadMembers();
});
