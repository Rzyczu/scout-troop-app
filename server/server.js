const http = require('http');
const app = require('./app');
const initApp = require('./init/initApp');


const PORT = process.env.PORT || 5000;

const server = http.createServer(app);


(async () => {
    try {
        await initApp();
        console.log('initialized');
        // Start serwera
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to initialize the database:', err.message);
        process.exit(1); // Zakończ proces, jeśli baza nie została zainicjalizowana
    }
})();