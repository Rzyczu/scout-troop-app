import fetchJson from '../../../utils/fetchJson';

const API_BASE_URL = '/api/troops';

const troopApi = {
    fetchTroopById: (id) => fetchJson(`${API_BASE_URL}/${id}`),
    fetchTroopUsers: (troopId) => fetchJson(`${API_BASE_URL}/${troopId}/users`),
    addUserToTroop: (troopId, userId) =>
        fetchJson(`${API_BASE_URL}/${troopId}/users`, {
            method: 'POST',
            body: JSON.stringify({ userId }),
        }),
    removeUserFromTroop: (troopId, userId) =>
        fetchJson(`${API_BASE_URL}/${troopId}/users/${userId}`, { method: 'DELETE' }),
    updateTroop: (troopId, data) =>
        fetchJson(`${API_BASE_URL}/${troopId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
};

export default troopApi;