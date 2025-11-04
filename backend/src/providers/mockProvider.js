const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Mock provider respond function that simulates latency and echoes input.
 * @param {string} input - Input text from the user.
 * @returns {Promise<{text:string}>} A promise resolving to an object with a text property.
 */
async function respond(input) {
    await delay(300);
    return { text: `MOCK: ${input}`};
}

export default { respond };