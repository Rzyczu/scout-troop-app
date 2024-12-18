import membersApi from './api.js';
import { showToast } from '../../../utils/ui.js';
import { updateTableRowIds } from '../../../utils/tableUtils.js';
import { checkRankAdequacy } from '../../../utils/adequacy.js';

export const loadTable = async (tableBody, getTableRow, view) => {
    try {
        const response = await membersApi.fetchAll();
        const members = response.members;
        const gender = response.gender;

        if (members.length === 0) {
            // Jeśli brak zastępów, wyświetl ostrzeżenie i komunikat w tabeli
            showToast('No members available.', 'warning');
            tableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center">No members to display. Add a member to get started.</td>
                </tr>
            `;
            return;
        };

        members.forEach(member => {
            member.rankAdequacy = checkRankAdequacy(member.achieved_rank, member.open_rank, member.date_birth, gender);
        });

        tableBody.innerHTML = members.map((member, index) => getTableRow(member, index, view, gender)).join('');
        updateTableRowIds(tableBody);

        return gender;
    } catch (error) {
        showToast(error.message || 'Failed to load members.', 'danger');
        return null;
    }
};