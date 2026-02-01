import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function listModels() {
    try {
        console.log("⏳ Fetching available models...");
        // Note: The library doesn't have a direct listModels, we usually have to check the error or use fetch
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await response.json();
        console.log("📝 API Response:", JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("❌ Failed to fetch models:", error);
    }
}

listModels();
