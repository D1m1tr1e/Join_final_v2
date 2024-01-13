const STORAGE_TOKEN = 'LPB2K87LLS1LW7ZFKEI328KQC3W44PB9DJ7MR5TU';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

/**
 * Sets an item in the storage.
 * @param {string} key - The key of the item.
 * @param {string} value - The value of the item.
 * @returns {Promise} - A promise that resolves with the response JSON.
 */
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
}

/**
 * Retrieves an item from the storage.
 * @param {string} key - The key of the item to retrieve.
 * @returns {Promise} - A promise that resolves with the retrieved value.
 * @throws {string} - Throws an error if the data with the given key is not found.
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => {
        if (res.data) {
            return res.data.value;
        } throw `Could not find data with key "${key}".`;
    });
}