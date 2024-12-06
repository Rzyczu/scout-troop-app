import './troops.scss';
import { loadTroops, attachSortingToHeaders } from './components/table.js';
import { resetForm, handleFormSubmit, handleEditTroop, handleDeleteTroop } from './components/form.js';
import { addSortableClassToHeaders } from './utils/helpers.js';
import sortTable from '../../utils/sortTable.js';
import initializeFormValidation from '../../utils/formValidation.js';

// DOM Elements
const troopsTableBody = document.getElementById('troopsTableBody');
const troopsTableHeader = document.querySelector('thead');
const troopForm = document.getElementById('troopForm');
const troopModalLabel = document.getElementById('troopModalLabel');
const troopLeaderSelect = document.getElementById('troopLeader');
const troopModal = new bootstrap.Modal(document.getElementById('troopModal'));

// Reload troops and render them in the table
const reloadTroops = async () => {
    await loadTroops(troopsTableBody);
};

// Handle form submission
troopForm.onsubmit = async function (event) {
    event.preventDefault();
    if (!this.checkValidity()) {
        this.classList.add('was-validated');
        return;
    }
    await handleFormSubmit(troopForm, troopModal, reloadTroops);
};

// Initialize module
document.addEventListener('DOMContentLoaded', async () => {
    initializeFormValidation();

    try {
        // Load troops into the table
        await reloadTroops();

        addSortableClassToHeaders(troopsTableHeader);
        attachSortingToHeaders(troopsTableHeader, troopsTableBody, sortTable);

        // Add event listener for "Add Troop" button
        document.getElementById('addTroopBtn').addEventListener('click', () => {
            resetForm(troopForm, troopModalLabel, troopLeaderSelect);
            troopModal.show();
        });

        // Add event listener for table actions (edit/delete)
        troopsTableBody.addEventListener('click', async (event) => {
            const target = event.target;

            // Handle Edit button
            if (target.classList.contains('editTroopBtn')) {
                await handleEditTroop(target, troopForm, troopModalLabel, troopModal);
            }

            // Handle Delete button
            else if (target.classList.contains('deleteTroopBtn')) {
                await handleDeleteTroop(target, reloadTroops);
            }
        });
    } catch (error) {
        console.error('Error initializing troops module:', error);
    }
});
