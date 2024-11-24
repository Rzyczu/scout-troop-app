export default function initializeFormValidation(customRules = []) {
    const forms = document.querySelectorAll('.needs-validation');

    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            event.preventDefault();
            event.stopPropagation();

            // Wyczyść poprzednie błędy
            clearErrors(form);

            // Walidacja niestandardowa
            const customErrors = validateCustomRules(form, customRules);

            // Jeśli są błędy, zatrzymaj wysyłanie formularza
            if (customErrors.length > 0) {
                displayErrors(form, customErrors);
                return;
            }

            // Jeśli walidacja przebiegła pomyślnie
            console.log('Form data is valid, ready to send!');
        });

        // Dynamiczna walidacja podczas wpisywania
        customRules.forEach(rule => {
            const field = form.querySelector(rule.selector);
            if (field) {
                field.addEventListener('input', () => {
                    const isValid = rule.validate(field.value, form);

                    // Usuń poprzednie klasy i zastosuj odpowiednią
                    field.classList.remove('is-invalid', 'is-valid');
                    if (isValid) {
                        field.classList.add('is-valid');
                    } else {
                        field.classList.add('is-invalid');
                    }

                    // Usuń błędy w czasie rzeczywistym
                    const errorDiv = field.parentNode.querySelector('.invalid-feedback');
                    if (errorDiv) {
                        errorDiv.textContent = isValid ? '' : rule.message;
                    }
                });
            }
        });
    });
}

// Reszta funkcji (validateCustomRules, displayErrors, clearErrors) pozostaje bez zmian


// Funkcja do sprawdzania niestandardowych reguł walidacji
function validateCustomRules(form, rules) {
    const errors = [];

    rules.forEach(rule => {
        const field = form.querySelector(rule.selector);
        if (field) {
            const isValid = rule.validate(field.value, form);
            if (!isValid) {
                console.log(field)
                errors.push({ field, message: rule.message });
            } else {
                // Usuń ewentualne wcześniejsze błędy, jeśli pole jest poprawne
                field.classList.remove('is-invalid');
                const errorDiv = field.parentNode.querySelector('.invalid-feedback');
                if (errorDiv) {
                    errorDiv.textContent = '';
                }
            }
        }
    });

    return errors;
}

// Funkcja do wyświetlania błędów
function displayErrors(form, errors) {
    errors.forEach(error => {
        const field = error.field;

        // Dodaj klasę `is-invalid` do błędnego pola
        field.classList.add('is-invalid');

        // Wyświetl komunikat błędu
        let errorDiv = field.parentNode.querySelector('.invalid-feedback');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback';
            field.parentNode.appendChild(errorDiv);
        }
        errorDiv.textContent = error.message;
    });
}

// Funkcja do czyszczenia poprzednich błędów
function clearErrors(form) {
    const invalidFields = form.querySelectorAll('.is-invalid');
    invalidFields.forEach(field => {
        field.classList.remove('is-invalid');
        const feedback = field.parentNode.querySelector('.invalid-feedback');
        if (feedback) {
            feedback.remove();
        }
    });
}
