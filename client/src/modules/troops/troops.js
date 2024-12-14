import './troops.scss';
import { loadTroops } from './components/table.js';
import { resetForm, handleFormSubmit, handleEditTroop, handleDeleteTroop } from './components/form.js';
import { sortTable, addSortableClassToHeaders, attachSortingToHeaders } from '../../utils/sortTable.js';
import { showColumnManagerModal, applyColumnPreferences } from '../../utils/columnManager.js';
import initializeFormValidation from '../../utils/formValidation.js';
import headersConfig from './config/headers.js';

// ** DOM Elements **
const troopsTableBody = document.getElementById('tableBody');
const troopsTableHeader = document.getElementById('tableHeaders');
const troopForm = document.getElementById('troopForm');
const troopModalLabel = document.getElementById('troopModalLabel');
const troopModal = new bootstrap.Modal(document.getElementById('troopModal'));

const reloadTable = async () => {
    await loadTroops(troopsTableBody);
    addSortableClassToHeaders(troopsTableHeader, headersConfig);
    attachSortingToHeaders(troopsTableHeader, troopsTableBody, sortTable);
};

// ** Handle form submission **
troopForm.onsubmit = async function (event) {
    event.preventDefault();
    if (!this.checkValidity()) {
        this.classList.add('was-validated');
        return;
    }
    await handleFormSubmit(troopForm, troopModal, reloadTable);
};

// ** Initialize module **
document.addEventListener('DOMContentLoaded', async () => {
    initializeFormValidation();

    try {
        // ** Load troops into the table **
        await loadTroops(troopsTableBody);
        // ** Add sorting to headers **
        addSortableClassToHeaders(troopsTableHeader, headersConfig);
        attachSortingToHeaders(troopsTableHeader, troopsTableBody, sortTable);
        console.log(troopsTableHeader)
        console.log(troopsTableBody)
        // ** Apply column preferences **
        applyColumnPreferences('troops', 'default', troopsTableHeader, troopsTableBody);

        // ** Event listener for Add Troop button **
        document.getElementById('addTroopBtn').addEventListener('click', async () => {
            await resetForm(troopForm, troopModalLabel, ['troopId', 'troopName'], 'troopLeader');
            troopModal.show();
        });

        // ** Event listener for Set Columns button **
        document.getElementById('setColumnsBtn')?.addEventListener('click', () => {
            const columns = headersConfig.map(header => header.label);
            showColumnManagerModal('troops', 'default', columns, troopsTableHeader, troopsTableBody);
        });

        // ** Event listener for table actions (edit/delete) **
        troopsTableBody.addEventListener('click', async (event) => {
            const target = event.target;

            if (target.classList.contains('editTroopBtn')) {
                await handleEditTroop(target, troopModalLabel, troopModal);
            } else if (target.classList.contains('deleteTroopBtn')) {
                await handleDeleteTroop(target, reloadTable);
            }
        });

    } catch (error) {
        console.error('Error initializing troops module:', error);
    }
});