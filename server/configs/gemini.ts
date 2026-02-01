import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';

console.log("💎 Gemini Config: Initializing Google AI Studio...");

const key = process.env.GEMINI_API_KEY;

if (!key) {
    console.error("❌ GEMINI_API_KEY is missing from .env!");
}

const genAI = new GoogleGenerativeAI(key || "");

// Using 'gemini-flash-latest' which was confirmed to work with this key
export const model = genAI.getGenerativeModel({
    model: "gemini-flash-latest",
});

console.log("💎 Gemini Config: Model 'gemini-flash-latest' ready.");

export default genAI;
