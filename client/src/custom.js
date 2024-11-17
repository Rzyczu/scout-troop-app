import './custom.scss'; // Importuj style z SCSS
import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;

// Globalne ustawienia
document.addEventListener('DOMContentLoaded', () => {
    console.log('Bootstrap JS initialized');
});

function logout() {
    document.cookie = "token=; Max-Age=0; path=/;"; // Clear the token cookie
    window.location.href = '/login'; // Redirect to login page
}

// Attach logout function to the global `window` object
window.logout = logout;