const loadNavbar = async () => {
    const navbarElement = document.getElementById('navbar');
    if (navbarElement) {
        try {
            const response = await fetch('/navbar.html'); // Pobranie zawartości navbaru
            const html = await response.text();
            navbarElement.innerHTML = html; // Wstawienie pobranego HTML
        } catch (error) {
            console.error('Failed to load navbar:', error);
        }
    }
};

const initializeNavbar = async () => {
    console.log('Navbar initialized globally');
    await loadNavbar(); // Czekaj na pełne załadowanie navbaru
};

export default initializeNavbar;