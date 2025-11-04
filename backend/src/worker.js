const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*", 
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-user-openai-key",
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...CORS_HEADERS,
    },
  });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS,
      });
    }

    
    if (request.method === "POST" && url.pathname === "/api/ai/respond") {
      try {
        const contentType = request.headers.get("Content-Type") || "";
        if (!contentType.includes("application/json")) {
          return jsonResponse({ error: "Expected application/json Content-Type" }, 400);
        }

        const body = await request.json().catch(() => null);
        const input = body?.input;
        const provider = (body?.provider || "").toLowerCase().trim() || "mock";

        if (typeof input !== "string" || input.trim() === "") {
          return jsonResponse({ error: "Missing 'input' (string) in JSON body" }, 400);
        }

        
        const reply = `Hello from Worker (provider: ${provider})`;

        return jsonResponse({ reply, provider }, 200);
      } catch (err) {
        console.error("Worker AI route error:", err);
        return jsonResponse(
          { error: "Server error", detail: String(err?.message || err) },
          500
        );
      }
    }

    
    return new Response("Not found", {
      status: 404,
      headers: CORS_HEADERS,
    });
  },
};