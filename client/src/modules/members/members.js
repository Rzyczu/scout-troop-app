import './members.scss';
import { sortTable } from '../../utils/sortTable.js';
import initializeFormValidation from '../../utils/formValidation.js';
import membersApi from './components/api.js';
import { showConfirmationModal, showToast } from '../../utils/ui.js';
import { addSortableClassToHeaders } from './utils/helpers.js';
import { getTableHeaders, renderTableRow, filterMembersByView, updateActiveViewButton } from './components/views.js';
import { loadTable, attachSortingToHeaders } from './components/table.js';
import { resetForm, handleFormSubmit, handleEditMember, handleDeleteMember } from './components/form.js';
import { populateSelect } from './utils/helpers.js';
import { setupMemberFormValidation } from './components/formValidation.js';
import { exportToJson, exportToCsv } from './components/exports.js';

// DOM elements
const membersTableBody = document.getElementById('membersTableBody');
const tableHeaders = document.getElementById('tableHeaders');
const memberForm = document.getElementById('memberForm');
const memberModal = new bootstrap.Modal(document.getElementById('memberModal'));
const modalLabel = document.getElementById('memberModalLabel');
const exportViewSelect = document.getElementById('exportViewSelect');

// Global variables
let currentView = 'basic';

// Function: Update table headers dynamically based on the view
const updateTableHeaders = (view) => {
    tableHeaders.innerHTML = getTableHeaders(view);
    addSortableClassToHeaders(tableHeaders);
    attachSortingToHeaders(tableHeaders, membersTableBody, sortTable);
};

const fetchAndPopulateTroops = async () => {
    try {
        const troops = await membersApi.fetchTroops();

        const formattedTroops = troops.reduce((acc, troop) => {
            acc[troop.id] = troop.name;
            return acc;
        }, {});

        populateSelect('troopSelect', formattedTroops, null, true);
    } catch (error) {
        showToast('Failed to load troops.', 'danger');
    }
};

// Initialize event listeners
document.addEventListener('DOMContentLoaded', async () => {
    // Set max date for date of birth
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dateBirth')?.setAttribute('max', today);

    // Initialize form validation
    setupMemberFormValidation(initializeFormValidation);

    // Update active view button and load initial data
    updateActiveViewButton(currentView);
    updateTableHeaders(currentView);
    const gender = await loadTable(membersTableBody, renderTableRow, currentView);

    // Populate dropdowns with enums
    if (gender !== undefined && gender !== null) {
        populateSelect('scoutFunction', ScoutFunctions, gender);
        populateSelect('openRank', ScoutRanks, gender);
        populateSelect('achievedRank', ScoutRanks, gender);
        populateSelect('instructorRank', InstructorRanks, gender);
    }

    // Add event listener to the "Add Member" button
    document.getElementById('addMemberBtn').addEventListener('click', async () => {
        await fetchAndPopulateTroops();
        resetForm(memberForm, modalLabel,
            [
                'userId',
                'name',
                'surname',
                'dateBirth',
                'phoneNumber',
                'motherPhoneNumber',
                'fatherPhoneNumber',
                'parentEmail1',
                'parentEmail2',
            ],
            [
                'scoutFunction',
                'openRank',
                'achievedRank',
                'instructorRank',
                'troopSelect'
            ]
        );
        memberModal.show();
    });

    // Add event listener for form submission
    memberForm.onsubmit = async function (event) {
        event.preventDefault();
        if (!this.checkValidity()) {
            this.classList.add('was-validated');
            return;
        }
        await handleFormSubmit(memberForm, memberModal, async () =>
            loadTable(membersTableBody, renderTableRow, currentView)
        );
    };

    // Add event listener for view buttons
    document.querySelectorAll('.view-btn').forEach((btn) => {
        btn.addEventListener('click', async () => {
            currentView = btn.dataset.view;
            updateActiveViewButton(currentView);
            updateTableHeaders(currentView);
            await loadTable(membersTableBody, renderTableRow, currentView);
        });
    });

    // Add event listener for table actions (edit/delete)
    membersTableBody.addEventListener('click', async (event) => {
        const target = event.target;

        if (target.classList.contains('editMemberBtn')) {
            await handleEditMember(target, memberForm, modalLabel, memberModal);
        } else if (target.classList.contains('deleteMemberBtn')) {
            await handleDeleteMember(target, async () =>
                loadTable(membersTableBody, renderTableRow, currentView)
            );
        }
    });

    // Add event listeners for export buttons
    document.getElementById('exportJsonBtn').addEventListener('click', async () => {
        const view = exportViewSelect.value;
        try {
            const results = await membersApi.fetchAll();
            const members = results.members;
            const gender = results.gender;
            const filteredMembers = filterMembersByView(members, view, gender, true);
            exportToJson(filteredMembers, view);
        } catch (error) {
            showToast('Failed to export file.', 'danger');
        }
    });

    document.getElementById('exportCsvBtn').addEventListener('click', async () => {
        const view = exportViewSelect.value;
        try {
            const results = await membersApi.fetchAll();
            const members = results.members;
            const gender = results.gender;
            const filteredMembers = filterMembersByView(members, view, gender);
            exportToCsv(filteredMembers, view);
        } catch (error) {
            showToast('Failed to export file.', 'danger');
        }
    });
});
