import express from "express";
const router = express.Router();

router.post("/respond", (req, res) => {
    res.json({ message: "AI route working"});
});

export default router;