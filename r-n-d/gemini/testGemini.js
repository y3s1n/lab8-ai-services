import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("Missing GEMINI_API_KEY")
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash"});

async function run() {
    try {
        const prompt = "Say hello in one short sentence.";

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        console.log("Gemini replied:", text);
    } catch (err) {
        console.error("Gemini API error:", err);
    }
}

run();