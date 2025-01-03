import api from './api.js';
import { showToast } from '../../../utils/ui.js';

export const handleLoginSubmit = async (form, onSuccess) => {
    const formData = new FormData(form);
    const payload = JSON.stringify(Object.fromEntries(formData));

    try {
        const result = await api.login(payload);
        if (result.gender) {
            localStorage.setItem('gender', String(result.gender));
        }

        onSuccess();
    } catch (error) {
        showToast(error.message || 'Failed to login.', 'danger');
    }
};
