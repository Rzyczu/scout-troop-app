import './members.scss';
import { sortTable, addSortableClassToHeaders, attachSortingToHeaders } from '../../utils/sortTable.js';
import initializeFormValidation from '../../utils/formValidation.js';
import membersApi from './components/api.js';
import { showToast, showTooltip } from '../../utils/ui.js';
import { getTableHeaders, renderTableRow, filterMembersByView, updateActiveViewButton } from './components/views.js';
import { loadTable } from './components/table.js';
import { resetForm, handleFormSubmit, handleEditMember, handleDeleteMember } from './components/form.js';
import { setupMemberFormValidation } from './components/formValidation.js';
import { exportToJson, exportToCsv } from './components/exports.js';
import { createSelectPopulator } from '../../utils/selectFactory';
import { showColumnManagerModal, applyColumnPreferences } from '../../utils/columnManager.js';
import { updateTableRowIds } from '../../utils/tableUtils.js';
import headersConfig from './config/headers.js';

// **Populators for selects** 
const populateTroopSelect = createSelectPopulator({
    valueField: 'id',
    textField: 'name',
    addNone: true
});

const populateScoutFunctions = createSelectPopulator({
    valueField: 'id',
    textField: 'name',
    addNone: false,
    mapEnum: true
});

const populateRanks = createSelectPopulator({
    valueField: 'id',
    textField: 'name',
    addNone: false,
    mapEnum: true
});

// DOM elements
const tableBody = document.getElementById('tableBody');
const tableHeaders = document.getElementById('tableHeaders');
const memberForm = document.getElementById('memberForm');
const memberModal = new bootstrap.Modal(document.getElementById('memberModal'));
const modalLabel = document.getElementById('memberModalLabel');
const exportViewSelect = document.getElementById('exportViewSelect');
const adequacyInfoIcon = document.getElementById('adequacyInfoIcon');

// Global variables
let currentView = 'basic';
let gender = null;
let isAdequacyHighlighted = false;

// Function: Update table headers dynamically based on the view
const updateTableHeaders = (view) => {
    tableHeaders.innerHTML = getTableHeaders(view);
    addSortableClassToHeaders(tableHeaders, headersConfig[currentView]);
    attachSortingToHeaders(tableHeaders, tableBody, sortTable);
};

// Function: Fetch and populate troop select
const fetchAndPopulateTroops = async () => {
    try {
        const troops = await membersApi.fetchTroops();
        console.log('Fetched Troops:', troops);

        await populateTroopSelect('troopSelect', troops);
    } catch (error) {
        console.error('Error populating troop select:', error.message);
        showToast('Failed to load troops.', 'danger');
    }
};

const generateRankAdequacyMessage = () => {
    const roles = { 0: 'male', 1: 'female' };
    const titles = { male: 'Harcerze', female: 'Harcerki' };
    const genderRole = roles[gender];
    let message = `<strong> ${titles[genderRole]}</strong>`;
    message += `<table class="adequacy-table">
        <thead>
            <tr>
                <th>Rank</th>
                <th>Age</th>
            </tr>
        </thead>
        <tbody>`;

    Object.values(ScoutRanks).forEach(rank => {
        if (rank[genderRole]) {
            const { full, ageRange } = rank[genderRole];
            message += `
                <tr>
                    <td>${full}</td>
                    <td>${ageRange.min} - ${ageRange.max} lat</td>
                </tr>`;
        }
    });

    message += `</tbody></table>`;
    return message;
};


// Add event listener for form submission
memberForm.onsubmit = async function (event) {
    event.preventDefault();
    if (!this.checkValidity()) {
        this.classList.add('was-validated');
        return;
    }
    await handleFormSubmit(memberForm, memberModal, reloadMembers);
};

const reloadMembers = async () => {
    const view = currentView;
    gender = gender || await loadTable(tableBody, renderTableRow, view);
    await loadTable(tableBody, renderTableRow, view);

    updateTableHeaders(view);
    applyColumnPreferences('members', view, tableHeaders, tableBody);
};

const toggleAdequacyColors = () => {
    const rows = document.querySelectorAll('#tableBody tr');
    isAdequacyHighlighted = !isAdequacyHighlighted; // Przełączanie stanu (true <-> false)
    rows.forEach(row => {
        row.classList.remove('row-green', 'row-light-green', 'row-red');

        if (isAdequacyHighlighted) {
            const rankAdequacy = row.getAttribute('data-rank-adequacy');
            if (rankAdequacy) {
                row.classList.add(`row-${rankAdequacy}`);
            }
        }
    });
};

document.getElementById('checkAdequacyBtn')?.addEventListener('click', () => {
    toggleAdequacyColors();
});


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
    applyColumnPreferences('members', currentView, tableHeaders, tableBody);

    console.log("xd")

    await reloadMembers();

    console.log(generateRankAdequacyMessage())
    showTooltip(adequacyInfoIcon, generateRankAdequacyMessage, "bottom");

    updateTableRowIds(tableBody);

    // Populate dropdowns with enums
    if (gender !== undefined && gender !== null) {
        await populateScoutFunctions('scoutFunction', ScoutFunctions, null, gender);
        await populateRanks('openRank', ScoutRanks, null, gender);
        await populateRanks('achievedRank', ScoutRanks, null, gender);
        await populateRanks('instructorRank', InstructorRanks, null, gender);
    }
    await fetchAndPopulateTroops();

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

    // Add event listener for view buttons
    document.querySelectorAll('.view-btn').forEach((btn) => {
        btn.addEventListener('click', async () => {
            currentView = btn.dataset.view;
            updateActiveViewButton(currentView);
            updateTableHeaders(currentView);
            await reloadMembers();
            applyColumnPreferences('members', currentView, tableHeaders, tableBody); // Stosowanie preferencji po załadowaniu widoku
            if (isAdequacyHighlighted) {
                isAdequacyHighlighted = !isAdequacyHighlighted
                toggleAdequacyColors();
            }
        });
    });


    document.getElementById('setColumnsBtn')?.addEventListener('click', () => {
        const columns = Array.from(tableHeaders.querySelectorAll('th')).map(th => th.textContent.trim());
        showColumnManagerModal('members', currentView, columns, tableHeaders, tableBody);
    });

    // Add event listener for table actions (edit/delete)
    tableBody.addEventListener('click', async (event) => {
        const target = event.target;

        if (target.classList.contains('editMemberBtn')) {
            await handleEditMember(target, modalLabel, memberModal);
        } else if (target.classList.contains('deleteMemberBtn')) {
            await handleDeleteMember(target, async () =>
                loadTable(tableBody, renderTableRow, currentView)
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
