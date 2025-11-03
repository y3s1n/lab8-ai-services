import mockProvider from "./mockProvider.js";
import elizaProvider from "./elizaProvider.js";
import OpenAIProvider from "./openaiProvider.js";

const registry = {
    mock: () => mockProvider,
    eliza: () => elizaProvider,
    openai: ({ apiKey } = {}) => new OpenAIProvider(apiKey), 

};

export function getProvider(name, config = {}) {
    const key = (name || '').toLowerCase();
    const hub = registry[key] || registry.eliza;
    return hub(config);
}