const OPENAI_KEY_STORAGE = 'openai_user_key';

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

export function getStoredOpenAIKey() {
    try {
        return localStorage.getItem(OPENAI_KEY_STORAGE) || '';
    } catch {
        return '';
    }
}

export function setStoredOpenAIKey(key) {
    try {
        localStorage.setItem(OPENAI_KEY_STORAGE, key);
    } catch {}
}

export function clearStoredOpenAIKey() {
    try {
        localStorage.removeItem(OPENAI_KEY_STORAGE);
    } catch {}
}