export const populateSelect = (selectElement, data) => {
    if (!selectElement) {
        console.warn(`Select element not found.`);
        return;
    }

    selectElement.innerHTML = ''; // Clear existing options

    data.forEach((item) => {
        const option = document.createElement('option');
        option.value = item.value;
        option.textContent = item.label;
        selectElement.appendChild(option);
    });
};
