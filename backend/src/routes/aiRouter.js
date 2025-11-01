import express from "express";
import mockProvider from "../providers/mockProvider.js";
const router = express.Router();

router.post("/respond", async (req, res) => {
    console.log("received body:", req.body);

    
    const userInput = req.body.input;
    if (typeof userInput === "undefined") {
        return res.status(400).json({ error: "Missing 'input' in JSON body"})
    }
    
    const mockResponse = await mockProvider.respond(userInput);
    res.json({ reply: mockResponse.text });
});

export default router;