import './login.scss';

document.getElementById('loginForm').onsubmit = async function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);
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
            console.log(result)
            const error = Object.values(errorMessages.login).find(
                (err) => err.code === result.code
            );
            const message = error?.message || 'An unexpected error occurred.';
            alert(message);
        }
    } catch (err) {
        console.error('Error during login:', err);
        alert('An error occurred during login. Please try again.');
    }
};
