import './troops.scss';
import { fetchAllTroops, createTroop } from './components/api';
import initializeFormValidation from '../../utils/formValidation';
import { resetForm, populateSelect } from './components/form';
import { renderTableRows, attachSortingToHeaders } from './components/table';

// DOM Elements
const troopsTableBody = document.getElementById('troopsTableBody');
const troopForm = document.getElementById('troopForm');
const troopLeaderSelect = document.getElementById('troopLeader');
const troopModal = new bootstrap.Modal(document.getElementById('troopModal'));

// Initialization
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load troops into the table
        const troops = await fetchAllTroops();
        renderTableRows(troopsTableBody, troops);

        // Load leaders into the select field
        const leaders = await fetchAllTroops('leaders');
        populateSelect(troopLeaderSelect, leaders);

        // Attach sorting
        attachSortingToHeaders(troopsTableBody);

        // Form validation
        initializeFormValidation();
    } catch (error) {
        console.error('Error initializing troops module:', error);
    }
});

// Handle form submission
troopForm.onsubmit = async (event) => {
    event.preventDefault();
    if (!troopForm.checkValidity()) {
        troopForm.classList.add('was-validated');
        return;
    }

    const name = document.getElementById('troopName').value;
    const leaderId = troopLeaderSelect.value;

    try {
        await createTroop({ name, leaderId });
        troopModal.hide();
        location.reload(); // Reload the page to see updated data
    } catch (error) {
        console.error('Error creating troop:', error);
    }
};
