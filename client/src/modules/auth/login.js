import './login.scss';
import globalBootstrap from '../../utils/global/globalBootstrap.js';
import { setupLoginValidation } from './utils/validation.js';
import { handleLoginSubmit } from './components/form.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    setupLoginValidation(loginForm);

    loginForm.onsubmit = async function (event) {
        event.preventDefault();

        if (!this.checkValidity()) {
            this.classList.add('was-validated');
            return;
        }

        await handleLoginSubmit(this, (response) => {
            window.location.href = '/dashboard';
        });
    };

});
