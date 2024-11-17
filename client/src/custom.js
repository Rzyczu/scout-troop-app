import './custom.scss'; // Importuj style z SCSS
import 'bootstrap/dist/js/bootstrap.bundle';

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