import express from "express";
import cors from "cors";
import aiRouter from "./routes/aiRouter.js";

const app = express();
app.use(express.json());

const PORT = 3000;

app.use(cors());
app.use("/api/ai", aiRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});

