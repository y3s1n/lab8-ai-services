import express from "express";
import cors from "cors";

const app = express();

const PORT = 3000;

app.use(cors());

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});

app.get("/api/test", (req, res) => {
    res.send("API working!");
});