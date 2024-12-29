import './dashboard.scss';

// Pobieranie danych z nowego endpointu /api/dashboard
// fetch('/api/dashboard', {
//     method: 'GET',
//     credentials: 'include' // Umożliwia wysyłanie ciasteczek z żądaniem
// })
//     .then(response => response.json())
//     .then(data => {
//         if (data.error) {
//             alert(data.error);
//             window.location.href = '/auth';
//         } else {
//             console.log(data);
//             document.getElementById('content').innerText = JSON.stringify(data, null, 2);
//         }
//     })
//     .catch(error => console.error('Error:', error));
