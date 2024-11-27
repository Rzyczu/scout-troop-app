export const addSortableClassToHeaders = (tableHeaders) => {
    const headers = tableHeaders.querySelectorAll('th');

    headers.forEach((header) => {
        if (!header.textContent.trim().toLowerCase().includes('actions')) {
            header.classList.add('sortable');
        }
    });
};

export const populateSelect = (selectId, data) => {
    const select = document.getElementById(selectId);

    if (!select) {
        console.warn(`Select element with ID '${selectId}' not found.`);
        return;
    }

    select.innerHTML = ''; // Clear any existing options

    Object.entries(data).forEach(([key, value]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = typeof value === 'string' ? value : value.full || value.short || key;
        select.appendChild(option);
    });
};
