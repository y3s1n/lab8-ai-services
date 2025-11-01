import express from "express";
import { getProvider } from "../providers/providerHub.js";
const router = express.Router();

router.post("/respond", async (req, res) => {
    console.log("received body:", req.body);

    
    const input = req.body?.input;
    if (typeof input !== "string") {
        return res.status(400).json({ error: "Missing 'input' in JSON body"})
    }
    
    const providerName = req.body?.provider;
    const provider = getProvider(providerName)
    
    const { text } = await provider.respond(input);
    res.json({ reply: text, provider: providerName ?? "mock" });
});

export default router;