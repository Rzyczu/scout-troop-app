import { mapEnumFullName, mapEnumShortName, InstructorRanks, ScoutRanks, ScoutFunctionss } from "./enums";

export const createSelectPopulator = ({
    valueField = 'id',
    textField = 'name',
    addNone = false,
    mapEnum = false,
}) => {
    return (selectId, data = [], selectedValue = null, gender = null) => {
        return new Promise((resolve) => {
            const selectField = document.getElementById(selectId);
            if (!selectField) {
                console.warn(`Select element with ID '${selectId}' not found.`);
                return resolve();
            }

            // Clear existing options
            selectField.innerHTML = '';

            // Add "None" option if requested
            if (addNone) {
                const option = document.createElement('option');
                option.value = 0;
                option.textContent = 'None';
                selectField.appendChild(option);
            }

            // Handle data conversion for enums
            let enumData = data; // Preserve the original enum for mapping
            if (!Array.isArray(data)) {
                data = Object.entries(data).map(([key, value]) => {
                    let text;
                    if (mapEnum) {
                        // Map enum values using the provided function
                        text = mapEnumFullName(enumData, key, gender);
                    } else {
                        // Handle gender-specific object or direct value
                        text =
                            typeof value === 'object'
                                ? value.male || value.female || value.full || ''
                                : value;
                    }

                    return {
                        [valueField]: key,
                        [textField]: text,
                    };
                });
            }

            // Populate options in the select field
            data.forEach((item) => {
                const option = document.createElement('option');
                option.value = item[valueField];
                option.textContent =
                    typeof textField === 'function'
                        ? textField(item)
                        : item[textField];

                if (selectedValue && item[valueField] == selectedValue) {
                    option.selected = true;
                }

                selectField.appendChild(option);
            });

            resolve();
        });
    };
};
