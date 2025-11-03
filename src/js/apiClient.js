

/**
 * @param {string} input - the users message
 * @param {string} provider - which provider to use
 * @returns {promise<{ reply: string, provider: string}>}
 */
export async function sendToAI(input, provider = "eliza") {
    try {
        const response = await fetch("http://localhost:3000/api/ai/respond", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({ input, provider }),
        });

        const data = await response.json();

        return { reply: data.reply, provider: data.provider };
    } catch (error) {
        console.error("Error communicating with AI backend", error);
        return { reply: "[Error contacting AI server]", provider}
    }
}