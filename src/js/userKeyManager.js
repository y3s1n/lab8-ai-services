const OPENAI_KEY_STORAGE = 'openai_user_key';

/**
 * Prompt the user for their OpenAI API key if not already stored.
 * Validates that the key starts with "sk-" and stores it in localStorage.
 * @returns {Promise<string>} The stored OpenAI API key.
 * @throws {Error} If the key is missing or invalid.
 */
export async function getUserOpenAIKey() {
    const existing = getStoredOpenAIKey();
    if (existing) return existing;

    const input = window.prompt('Enter your OpenAI API key (starts with "sk-"):');
    const key = (input || '').trim();

    if (!key || !/^sk-/.test(key)) {
        throw new Error('Invalid OpenAI API key. it should start with "sk-".');
    }

    setStoredOpenAIKey(key);
    return key;
}

/**
 * Read the stored OpenAI key from localStorage.
 * @returns {string} The stored key or an empty string if not present.
 */
export function getStoredOpenAIKey() {
    try {
        return localStorage.getItem(OPENAI_KEY_STORAGE) || '';
    } catch {
        return '';
    }
}

/**
 * Store the OpenAI key in localStorage.
 * @param {string} key - The API key to store.
 * @returns {void}
 */
export function setStoredOpenAIKey(key) {
    try {
        localStorage.setItem(OPENAI_KEY_STORAGE, key);
    } catch {}
}

/**
 * Remove the stored OpenAI key from localStorage.
 * @returns {void}
 */
export function clearStoredOpenAIKey() {
    try {
        localStorage.removeItem(OPENAI_KEY_STORAGE);
    } catch {}
}