const http = require('http');
const app = require('./app');
const initializeDatabase = require('./init/initializeDatabase');
const addAdminUser = require('./init/addAdminUser');
const addUser1 = require('./init/addUser1');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);


(async () => {
    try {
        await initializeDatabase(); // Inicjalizacja bazy danych
        await addAdminUser(); // Inicjalizacja bazy danych
        await addUser1(); // Inicjalizacja bazy danych


        // Start serwera
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to initialize the database:', err.message);
        process.exit(1); // Zakończ proces, jeśli baza nie została zainicjalizowana
    }
})();