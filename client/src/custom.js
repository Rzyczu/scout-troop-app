import './custom.scss'; // Importuj style z SCSS
import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;
import { UserRoles, ScoutRanks, InstructorRanks, ScoutFunctions, mapEnumFullName, mapEnumShortName } from './utils/enums';
window.UserRoles = UserRoles;
window.ScoutRanks = ScoutRanks;
window.InstructorRanks = InstructorRanks;
window.ScoutFunctions = ScoutFunctions;
window.mapEnumFullName = mapEnumFullName;
window.mapEnumShortName = mapEnumShortName

// Globalne ustawienia
document.addEventListener('DOMContentLoaded', () => {
    //console.log('Bootstrap JS initialized');
});

function logout() {
    document.cookie = "token=; Max-Age=0; path=/;"; // Clear the token cookie
    window.location.href = '/login'; // Redirect to login page
}


// Attach logout function to the global `window` object
window.logout = logout;