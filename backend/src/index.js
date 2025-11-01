import express from "express";

const app = express();

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});

app.get("/api/test", (req, res) => {
    res.send("API working!");
});