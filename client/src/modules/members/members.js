import './members.scss';
import TableComponent from '../../components/table/TableComponent.js';
import membersApi from './components/api.js';
import { resetForm, handleFormSubmit, handleEditMember, handleDeleteMember } from './components/form.js';
import { setupMemberFormValidation } from './components/formValidation.js';
import headersConfig from './config/headers.js';
import initializeFormValidation from '../../utils/formValidation.js';
import { createSelectPopulator } from '../../utils/selectFactory.js';
import { showToast } from '../../utils/ui.js';

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

// Function: Fetch and populate troop select
const fetchAndPopulateTroops = async () => {
    try {
        const troops = await membersApi.fetchTroops();
        await populateTroopSelect('troopSelect', troops);
    } catch (error) {
        console.error('Error populating troop select:', error.message);
        showToast('Failed to load troops.', 'danger');
    }
};

// DOM Elements
const memberForm = document.getElementById('memberForm');
const memberModal = new bootstrap.Modal(document.getElementById('memberModal'));
const modalLabel = document.getElementById('memberModalLabel');

const gender = Number(localStorage.getItem('gender'));
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize form validation
    setupMemberFormValidation(initializeFormValidation);

    try {
        // TableComponent Initialization
        const table = new TableComponent({
            containerId: 'tableContainer',
            headersConfig: headersConfig,
            api: membersApi,
            exportEnabled: true,
            columnManagerEnabled: true,
            enableAdequacy: true,
            onEdit: (id) => handleEditMember({ dataset: { id } }, modalLabel, memberModal),
            onDelete: (id) => handleDeleteMember({ dataset: { id } }, () => table.reloadTable()),
        });

        // Populate select fields using gender
        if (gender !== undefined) {
            await populateScoutFunctions('scoutFunction', ScoutFunctions, null, gender);
            await populateRanks('openRank', ScoutRanks, null, gender);
            await populateRanks('achievedRank', ScoutRanks, null, gender);
            await populateRanks('instructorRank', InstructorRanks, null, gender);
        }
        await fetchAndPopulateTroops();

        // Handle form submission
        memberForm.onsubmit = async function (event) {
            event.preventDefault();
            if (!this.checkValidity()) {
                this.classList.add('was-validated');
                return;
            }
            await handleFormSubmit(memberForm, memberModal, () => table.reloadTable());
        };

        // Add Member button logic
        document.getElementById('addMemberBtn').addEventListener('click', async () => {
            resetForm(memberForm, modalLabel,
                ['userId', 'name', 'surname', 'dateBirth', 'phoneNumber', 'motherPhoneNumber', 'fatherPhoneNumber', 'parentEmail1', 'parentEmail2'],
                ['scoutFunction', 'openRank', 'achievedRank', 'instructorRank', 'troopSelect']
            );
            memberModal.show();
        });

    } catch (error) {
        console.error('Error initializing members module:', error);
        showToast('Failed to initialize the members table.', 'danger');
    }
});
