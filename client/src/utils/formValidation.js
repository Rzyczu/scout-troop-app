export default function initializeFormValidation(customRules = []) {
    const forms = document.querySelectorAll('.needs-validation');

    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            event.preventDefault();
            event.stopPropagation();

            // Wyczyść poprzednie błędy
            clearErrors(form);

            // Sprawdź wbudowaną walidację przeglądarki
            const isValid = form.checkValidity();
            form.classList.add('was-validated');

            // Walidacja niestandardowa
            const customErrors = validateCustomRules(form, customRules);

            if (!isValid || customErrors.length > 0) {
                displayErrors(form, customErrors);
                return; // Zatrzymaj, jeśli występują błędy
            }

            // Jeśli wszystko jest poprawne
            console.log('Form data is valid, ready to send!');
        });
    });
}

// Funkcja do sprawdzania niestandardowych reguł walidacji
function validateCustomRules(form, rules) {
    const errors = [];

    rules.forEach(rule => {
        const field = form.querySelector(rule.selector);
        if (field) {
            const isValid = rule.validate(field.value, form);
            if (!isValid) {
                errors.push({ field, message: rule.message });
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
