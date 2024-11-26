// ./components/formValidation.js

/**
 * Initializes validation by merging custom rules with existing validation logic.
 * @param {Function} initializeFormValidation - The existing form validation initializer.
 */
export const setupMemberFormValidation = (initializeFormValidation) => {
    const rules = [
        {
            selector: '#dateBirth',
            validate: (value) => {
                const today = new Date();
                const birthDate = new Date(value);

                if (isNaN(birthDate.getTime())) {
                    return false;
                }

                const age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                const dayDiff = today.getDate() - birthDate.getDate();

                return (
                    age >= 6 &&
                    age <= 100 &&
                    (age > 6 || monthDiff >= 0) &&
                    (age > 6 || monthDiff > 0 || dayDiff >= 0) &&
                    birthDate <= today
                );
            },
            message: 'Invalid date of birth. Must be between 6 and 100 years old, and not in the future.',
        },
        {
            selector: '#phoneNumber, #fatherPhoneNumber, #motherPhoneNumber',
            validate: (value) => {
                const phoneRegex = /^(\+?[0-9]{1,3})?[0-9]{9,12}$/;
                return phoneRegex.test(value);
            },
            message: 'Invalid phone number. Must be 9-12 digits and optionally include a country code.',
        },
    ];

    // Pass custom rules to the global form validation function
    initializeFormValidation(rules);
};
