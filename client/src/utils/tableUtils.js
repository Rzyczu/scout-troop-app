export const updateTableRowIds = (tableBody) => {
    const rows = Array.from(tableBody.querySelectorAll('tr'));
    rows.forEach((row, index) => {
        const idCell = row.querySelector('.dynamic-id');
        if (idCell) idCell.textContent = index + 1;
    });
};
