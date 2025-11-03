import mockProvider from "./mockProvider.js";
import elizaProvider from "./elizaProvider.js";

const registry = {
    mock: mockProvider,
    eliza: elizaProvider,
};

export function getProvider(name) {
    const key = typeof name === "string" ? name.toLowerCase().trim() : "eliza";
    return registry[key] ?? registry.eliza;
}