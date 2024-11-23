import './login.scss';
import globalBootstrap from '../../utils/global/globalBootstrap.js';
import initializeFormValidation from '../../utils/formValidation.js';
import errorMessages from '../../utils/errors/index';
import showToast from '../../utils/errorMessagesToasts.js';
const customValidationRules = [
    {
        selector: '#email', // Selektor pola
        validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), // Reguła sprawdzająca e-mail
        message: 'Please provide a valid email address.', // Wiadomość wyświetlana w przypadku błędu
    },
];
// Inicjalizacja walidacji formularza
document.addEventListener('DOMContentLoaded', () => {
    initializeFormValidation();
});

// Obsługa przesyłania formularza
document.getElementById('loginForm').onsubmit = async function (event) {
    event.preventDefault(); // Zatrzymaj domyślne przesłanie formularza

    // Sprawdź, czy formularz jest poprawny
    if (!this.checkValidity()) {
        this.classList.add('was-validated'); // Dodaj klasy walidacyjne Bootstrapa
        return; // Zatrzymaj, jeśli formularz jest niepoprawny
    }

    console.log('E-mail jest poprawny!');


    const formData = new FormData(this);
    const payload = JSON.stringify(Object.fromEntries(formData));

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
        });

        const result = await response.json();

        if (result.success) {
            // Logowanie udane
            window.location.href = '/dashboard';
        } else {
            // Logowanie nieudane
            const error = Object.values(errorMessages.login).find(
                (err) => err.code === result.code
            );
            const message = error?.message || 'An unexpected error occurred.';
            showToast(message, 'danger');
        }
    } catch (err) {
        console.error('Error during login:', err);
        showToast('An error occurred during login. Please try again.');
    }
};
