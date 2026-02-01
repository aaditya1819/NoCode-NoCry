import { model } from "./configs/gemini.js";
import 'dotenv/config';

async function testGemini() {
    console.log("⏳ Testing Gemini API...");
    try {
        const prompt = "Say 'Hello, Gemini is working!'";
        const result = await model.generateContent(prompt);
        console.log("✅ Gemini Response:", result.response.text());
    } catch (error) {
        console.error("❌ Gemini API Failed:", error);
    }
}

testGemini();
