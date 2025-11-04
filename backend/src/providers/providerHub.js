import mockProvider from "./mockProvider.js";
import elizaProvider from "./elizaProvider.js";
import OpenAIProvider from "./openaiProvider.js";

const registry = {
    mock: () => mockProvider,
    eliza: () => elizaProvider,
    openai: ({ apiKey } = {}) => new OpenAIProvider(apiKey), 

};

/**
 * Retrieve a provider instance by name.
 * Supported names: 'mock', 'eliza', 'openai'.
 * For OpenAI, pass config = { apiKey: 'sk-...' }.
 * @param {string} name - Provider name.
 * @param {object} [config={}] - Optional configuration object for the provider.
 * @returns {object} Provider instance exposing a respond(input) method.
 */
export function getProvider(name, config = {}) {
    const key = (name || '').toLowerCase();
    const hub = registry[key] || registry.eliza;
    return hub(config);
}