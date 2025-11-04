import express from "express";
import { getProvider } from "../providers/providerHub.js";
const router = express.Router();

/**
 * POST /respond
 * Accepts JSON { input: string, provider?: string, apiKey?: string }
 * If provider === 'openai', an apiKey must be provided either in the request header
 * `x-user-openai-key` or as body.apiKey. Returns { reply, provider } on success.
 */
router.post("/respond", async (req, res) => {
   try {
    const input = req.body?.input;
    if (typeof input !== "string" || input.trim() === "") {
        return res.status(400).json({ error: "Missing 'input' in JSON body"});
    }

    const providerName = (req.body?.provider || "").toLowerCase().trim();
    
    const headerKey = req.get("x-user-openai-key") || req.header?.("x-user-openai-key");
    const bodyKey = req.body?.apiKey;
    const apiKey = headerKey || bodyKey || "";

    let provider;
    if (providerName === "openai") {
        if (typeof apiKey !== "string" || apiKey.trim() === "") {
            return res.status(400).json({ error: "Missing 'apiKey' for OpenAI provider"});
        }
        provider = getProvider("openai", { apiKey });
    } else {
        provider = getProvider(providerName);
    }

    const result = await provider.respond(input);
    const text = typeof result === "string" ? result : result?.text ?? "";

    return res.json({ reply: text, provider: providerName || "eliza"});
   } catch (err) {
    console.error("AI route error:", err);
    return res.status(500).json({ error: "Server error", detail: String(err.message || err)});
   }
});

export default router;