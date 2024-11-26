// ./components/api.js

import fetchJson from "../../../utils/fetchJson";

// Base URL for API endpoints
const API_BASE_URL = '/api/members';

export const membersApi = {
    fetchAll: () => fetchJson(`${API_BASE_URL}`),
    fetchById: (id) => fetchJson(`${API_BASE_URL}/${id}`),
    create: (data) => fetchJson(`${API_BASE_URL}`, { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => fetchJson(`${API_BASE_URL}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => fetchJson(`${API_BASE_URL}/${id}`, { method: 'DELETE' }),
};