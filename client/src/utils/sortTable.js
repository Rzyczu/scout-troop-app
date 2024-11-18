/**
 * Sorts an HTML table based on the selected column and direction.
 * 
 * @param {HTMLElement} tableBody - The table body (tbody) element containing rows.
 * @param {string} columnSelector - The data attribute or CSS selector for the column to sort by.
 * @param {number} direction - The sort direction: 1 for ascending, -1 for descending.
 */
export function sortTable(tableBody, columnSelector, direction) {
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    rows.sort((a, b) => {
        const aCell = a.querySelector(columnSelector)?.textContent.trim() || '';
        const bCell = b.querySelector(columnSelector)?.textContent.trim() || '';

        // Numeric comparison
        if (!isNaN(aCell) && !isNaN(bCell)) {
            return direction * (parseFloat(aCell) - parseFloat(bCell));
        }

        // String comparison
        return direction * aCell.localeCompare(bCell, undefined, { numeric: true });
    });

    // Rebuild the table body with sorted rows
    tableBody.innerHTML = '';
    rows.forEach(row => tableBody.appendChild(row));
}
