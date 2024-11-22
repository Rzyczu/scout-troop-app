export const loadNavbar = async () => {
    const navbarElement = document.getElementById('navbar');
    if (navbarElement) {
        try {
            const response = await fetch('/navbar.html');
            const html = await response.text();
            navbarElement.innerHTML = html;
        } catch (error) {
            console.error('Failed to load navbar:', error);
        }
    }
};