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
