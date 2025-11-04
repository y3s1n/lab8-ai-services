export default {
    async fetch(request, env, ctx) {
        return new Response("Ok from Cloudflare worker", {
            status: 200,
            headers: {
                "Content-Type": "text/plain",
            },
        });
    },
};