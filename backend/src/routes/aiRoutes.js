import express from "express";
const router = express.Router();

router.post("/respond", (req, res) => {
    console.log("received body:", req.body);

    
    const userInput = req.body?.input;
    if (typeof userInput === "undefined") {
        return res.status(400).json({ error: "Missing 'input' in JSON body"})
    }
    res.json({ received: userInput });
});

export default router;