export default async function fetchJson(url, options = {}) {
    const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });

    const result = await response.json();

    if (!result.success) {
        throw { message: result.error, code: result.code };
    }

    return result.data || result;
};