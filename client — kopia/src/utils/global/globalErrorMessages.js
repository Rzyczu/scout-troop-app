import errorMessages from '../errors';

// Dodanie do globalnego okna (jeśli wymagane)
window.errorMessages = errorMessages;

export default () => {
    console.log('Error messages initialized globally');
};
