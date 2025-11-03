export default class OpenAIProvider {
    constructor(apiKey) {
        if (!apiKey) {
            throw new Error('Missing OpenAI API key');
        }
        this.apiKey = apiKey;
        this.endpoint = 'https://api.openai.com/v1/responses';
    }

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