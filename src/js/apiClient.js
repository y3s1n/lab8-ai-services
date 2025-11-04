import { getUserOpenAIKey } from "./userKeyManager.js";

const API_BASE = "https://lab8-ai-backend.yqasem.workers.dev"

/**
 * @param {string} input - the users message
 * @param {string} provider - which provider to use
 * @returns {promise<{ reply: string, provider: string}>}
 */
export async function sendToAI(input, provider = "eliza") {
    try {
        const headers = { "Content-Type": "application/json" };

        if (provider === "openai") {
            const key = await getUserOpenAIKey();
            headers["x-user-openai-key"] = key;
        }

        const response = await fetch(`${API_BASE}/api/ai/respond`, {
            method: "POST",
            headers,
            body: JSON.stringify({ input, provider }),
        });

        const data = await response.json();

        return { reply: data.reply, provider: data.provider };
        } catch (error) {
            console.error("Error communicating with AI backend", error);
            return { reply: "[Error contacting AI server]", provider };
        }
}