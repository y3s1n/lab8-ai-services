const ENDPOINT = 'https://api.openai.com/v1/responses';

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
    console.error('Missing OPENAI_API_KEY environment variable.');
    process.exit(1);
}

const body = {
    model: 'gpt-4o-mini',
    input: 'Say hello in one short sentence.'
};

(async () => {
    const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`${res.status} ${res.statusText}: ${errText}`);
    }

    const data = await res.json();
    const text = data?.output?.[0]?.content?.[0]?.text ?? '';
    console.log('model said:', text)
})();
