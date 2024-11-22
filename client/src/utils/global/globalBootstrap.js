import * as bootstrap from 'bootstrap';

// Dodanie Bootstrap do globalnego okna (jeśli potrzebne)
window.bootstrap = bootstrap;

export default () => {
    console.log('Bootstrap initialized globally');
};
