import { mapEnumFullName, ScoutFunctions, ScoutRanks, InstructorRanks } from "../../../utils/enums";

export const populateSelect = (selectId, enumData, gender = null, addNone = false) => {
    const select = document.getElementById(selectId);
    if (!select) {
        console.warn(`Select element with ID '${selectId}' not found.`);
        return;
    }

    // Clear existing options
    select.innerHTML = '';

    if (addNone) {
        const option = document.createElement('option');
        option.value = 0;
        option.textContent = "None"
        select.appendChild(option);
    }

    // Populate options from enumData
    Object.entries(enumData).forEach(([key, value]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = mapEnumFullName(enumData, key, gender);
        select.appendChild(option);
    });
};
