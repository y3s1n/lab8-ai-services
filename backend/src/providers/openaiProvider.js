/**
 * OpenAIProvider is a thin wrapper around the OpenAI Responses API.
 */
export default class OpenAIProvider {
    /**
     * Create a provider instance.
     * @param {string} apiKey - OpenAI API key (Bearer token).
     */
    constructor(apiKey) {
        if (!apiKey) {
            throw new Error('Missing OpenAI API key');
        }
        this.apiKey = apiKey;
        this.endpoint = 'https://api.openai.com/v1/responses';
    }

    /**
     * Send input text to the OpenAI API and return the reply text.
     * @param {string} input - User input text to send to the model.
     * @returns {Promise<string>} The model's reply text.
     * @throws {Error} When the request fails or the API returns an error status.
     */
    async respond(input) {
        if (!input) {
            throw new Error('Missing input text');
        }

        const body = {
            model: 'gpt-4o-mini',
            input,
        };

        const res = await fetch(this.endpoint, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if(!res.ok) {
            const errText = await res.text();
            throw new Error(`OpenAI API error: ${res.status} ${res.statusText}\n${errText}`);
        }

        const data = await res.json();
        const reply = data?.output?.[0]?.content?.[0]?.text ?? '(no response)';
        return reply;
    }
}