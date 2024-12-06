import fetchJson from "../../../utils/fetchJson";

// Base URL for API endpoints
const API_BASE_URL = '/api/auth';

const api = {
    login: (data) =>
        fetchJson(`${API_BASE_URL}/login`, {
            method: 'POST',
            body: data
        }),
};

export default api;
