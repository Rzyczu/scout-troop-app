import initializeFormValidation from '../../../utils/formValidation.js';


export const setupLoginValidation = (form) => {
    initializeFormValidation();
    form.addEventListener('submit', (event) => {
        if (!form.checkValidity()) {
            event.preventDefault();
            form.classList.add('was-validated');
        }
    });
};
