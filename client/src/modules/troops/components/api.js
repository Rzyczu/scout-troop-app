import fetchJson from '../../../utils/fetchJson';

const API_BASE_URL = '/api/troops';

export const troopsApi = {
    fetchAll: () => fetchJson(`${API_BASE_URL}`),
    fetchById: (id) => fetchJson(`${API_BASE_URL}/${id}`),
    create: (data) => fetchJson(`${API_BASE_URL}`, { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => fetchJson(`${API_BASE_URL}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => fetchJson(`${API_BASE_URL}/${id}`, { method: 'DELETE' }),
    fetchLeaders: () => fetchJson(`${API_BASE_URL}/leaders`),
};
