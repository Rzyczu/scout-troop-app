// ./components/api.js

import fetchJson from "../../../utils/fetchJson";

// Base URL for API endpoints
const API_BASE_URL = '/api/members';

/**
 * Fetches the list of all members.
 * @returns {Promise<any[]>} - Array of members.
 */
export const fetchAllMembers = async () => {
    return await fetchJson(`${API_BASE_URL}`);
};

/**
 * Fetches details of a specific member.
 * @param {string} id - The ID of the member.
 * @returns {Promise<any>} - Member details.
 */
export const fetchMember = async (id) => {
    return await fetchJson(`${API_BASE_URL}/${id}`);
};

/**
 * Creates a new member.
 * @param {object} data - Data of the new member.
 * @returns {Promise<any>} - API response.
 */
export const createMember = async (data) => {
    return await fetchJson(`${API_BASE_URL}`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

/**
 * Updates an existing member's data.
 * @param {string} id - The ID of the member to update.
 * @param {object} data - Updated member data.
 * @returns {Promise<any>} - API response.
 */
export const updateMember = async (id, data) => {
    return await fetchJson(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
};

/**
 * Deletes a member.
 * @param {string} id - The ID of the member to delete.
 * @returns {Promise<any>} - API response.
 */
export const deleteMember = async (id) => {
    return await fetchJson(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
    });
};
