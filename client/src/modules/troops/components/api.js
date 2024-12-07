import fetchJson from '../../../utils/fetchJson';

const API_BASE_URL = '/api/troops';
const API_MEMBERS_URL = '/api/members';

const troopsApi = {
    fetchAll: () => fetchJson(`${API_BASE_URL}`),
    fetchById: (id) => fetchJson(`${API_BASE_URL}/${id}`),
    create: (data) => fetchJson(`${API_BASE_URL}`, { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => fetchJson(`${API_BASE_URL}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => fetchJson(`${API_BASE_URL}/${id}`, { method: 'DELETE' }),
    fetchMembers: () => fetchJson(`${API_MEMBERS_URL}`),
};

export default troopsApi;