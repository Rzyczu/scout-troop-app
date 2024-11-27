import fetchJson from "../../../utils/fetchJson";

// Base URL for API endpoints
const API_BASE_URL = '/api/users';
const API_MEMBERS_URL = '/api/members';

export const usersApi = {
    fetchAllUsers: () => fetchJson(`${API_MEMBERS_URL}`),
    fetchUsers: () => fetchJson(`${API_BASE_URL}`),
    fetchUser: (id) => fetchJson(`${API_BASE_URL}/${id}`),
    createUser: (data) => fetchJson(`${API_BASE_URL}`, { method: 'POST', body: JSON.stringify(data) }),
    updateUser: (id, data) => fetchJson(`${API_BASE_URL}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteUser: (id) => fetchJson(`${API_BASE_URL}/${id}`, { method: 'DELETE' }),
};