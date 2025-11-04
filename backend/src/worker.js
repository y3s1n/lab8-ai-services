import { getProvider } from "./providers/providerHub.js";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*", 
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-user-openai-key",
};

/**
 * Build a JSON Response with appropriate CORS headers for the worker.
 * @param {any} data - Data to serialize as JSON.
 * @param {number} [status=200] - HTTP status code.
 * @returns {Response} Fetch Response object with JSON body.
 */
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
  /**
   * Worker fetch handler - routes requests for the demo AI backend.
   * @param {Request} request - Incoming Request object.
   * @param {any} env - Environment bindings (unused).
   * @param {any} ctx - Execution context (unused).
   * @returns {Promise<Response>} Response object for the request.
   */
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

        if (typeof input !== "string" || input.trim() === "") {
          return jsonResponse({ error: "Missing 'input' (string) in JSON body" }, 400);
        }

        const providerName = (body?.provider || "").toLowerCase().trim();

       
        const apiKey = request.headers.get("x-user-openai-key") || "";

        
        let provider;
        if (providerName === "openai") {
          if (!apiKey.trim()) {
            return jsonResponse(
              { error: "Missing OpenAI API key (send it in 'x-user-openai-key' header)" },
              400
            );
          }
          provider = getProvider("openai", { apiKey });
        } else {
          
          provider = getProvider(providerName); 
        }

        
        const result = await provider.respond(input);
        const text = typeof result === "string" ? result : result?.text ?? "";

        return jsonResponse({ reply: text, provider: providerName || "mock" }, 200);
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