// ./components/exports.js
import { showToast } from '../../../utils/ui.js';

/**
 * Exports members data to a JSON file.
 * @param {Array} members - Array of member objects.
 * @param {string} view - The selected view type (e.g., 'basic', 'contact', 'scout').
 */
export const exportToJson = (members, view) => {
    if (!members || members.length === 0) {
        showToast('No members data available for export.', 'warning');
        console.warn('No members data available for export.');
        return;
    }

    const dataStr = JSON.stringify(members, null, 4);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `members_${view}.json`;
    link.click();

    URL.revokeObjectURL(url);
};

/**
 * Exports members data to a CSV file.
 * @param {Array} members - Array of member objects.
 * @param {string} view - The selected view type (e.g., 'basic', 'contact', 'scout').
 */
export const exportToCsv = (members, view) => {
    if (!members || members.length === 0) {
        showToast('No members data available for export.', 'warning');
        console.warn('No members data available for export.');
        return;
    }

    // Retrieve headers from the keys of the first member
    const headers = Object.keys(members[0]);

    // Generate CSV rows
    const rows = members.map(member =>
        headers.map(header => `"${String(member[header]).replace(/"/g, '""')}"`).join(';') // Escape quotes and use ';' as separator
    );

    // Combine headers and rows into a single CSV string
    const csvContent = `${headers.join(';')}\n${rows.join('\n')}`;

    // Create a Blob and download the CSV
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' }); // Add BOM for UTF-8
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `members_${view}.csv`;
    link.click();

    URL.revokeObjectURL(url);
};
