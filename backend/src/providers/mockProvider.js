const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function respond(input) {
    await delay(300);
    return { text: `MOCK: ${input}`};
}

export default { respond };