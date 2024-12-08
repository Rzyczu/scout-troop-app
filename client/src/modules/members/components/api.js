import fetchJson from "../../../utils/fetchJson";

// Base URL for API endpoints
const API_BASE_URL = '/api/members';
const API_TROOPS_URL = '/api/troops';

const membersApi = {
    fetchAll: () => fetchJson(`${API_BASE_URL}`),
    fetchById: (id) => fetchJson(`${API_BASE_URL}/${id}`),
    create: (data) => fetchJson(`${API_BASE_URL}`, { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => fetchJson(`${API_BASE_URL}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => fetchJson(`${API_BASE_URL}/${id}`, { method: 'DELETE' }),
    fetchTroops: () => fetchJson(`${API_TROOPS_URL}`),
};

export default membersApi;