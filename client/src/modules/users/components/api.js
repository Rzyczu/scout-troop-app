import fetchJson from "../../../utils/fetchJson";

// Base URL for API endpoints
const API_BASE_URL = '/api/users';
const API_MEMBERS_URL = '/api/members';

const usersApi = {
    fetchAllMembers: () => fetchJson(`${API_MEMBERS_URL}`),
    fetchAll: () => fetchJson(`${API_BASE_URL}`),
    fetchById: (id) => fetchJson(`${API_BASE_URL}/${id}`),
    create: (data) => fetchJson(`${API_BASE_URL}`, { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => fetchJson(`${API_BASE_URL}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => fetchJson(`${API_BASE_URL}/${id}`, { method: 'DELETE' }),
};

export default usersApi;