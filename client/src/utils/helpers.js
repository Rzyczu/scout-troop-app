export const populateSelect = (selectId, data, {
    valueField = 'id',
    textField = 'name',
    addNone = false,
    noneText = 'None',
    noneValue = 0,
    selectedValue = null
} = {}) => {
    const select = document.getElementById(selectId);
    if (!select) {
        console.warn(`Select element with ID '${selectId}' not found.`);
        return;
    }

    // Clear existing options
    select.innerHTML = '';

    // Add "None" option if needed
    if (addNone) {
        const option = document.createElement('option');
        option.value = noneValue;
        option.textContent = noneText;
        select.appendChild(option);
    }

    // Determine if `data` is an object (enum) or an array (list of objects)
    const entries = Array.isArray(data)
        ? data.map(item => ({
            value: item[valueField] ?? item.id,
            text: item[textField] ?? item.name
        }))
        : Object.entries(data).map(([key, value]) => ({
            value: key,
            text: value
        }));

    // Populate options from the data
    entries.forEach(({ value, text }) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = text;

        if (selectedValue !== null && value == selectedValue) {
            option.selected = true;
        }

        select.appendChild(option);
    });
};