import OpenAI from "openai";
import 'dotenv/config';

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.AI_API_KEY,
});

async function main() {
    console.log("⏳ [OPENROUTER] Testing with OpenAI SDK...");
    try {
        const completion = await openai.chat.completions.create({
            model: "google/gemini-2.0-flash-exp:free",
            messages: [
                { role: "user", content: "Say 'Success'" }
            ],
        });
        console.log("✅ Response:", completion.choices[0].message.content);
    } catch (error: any) {
        console.error("❌ Error:", error.message);
    }
}

main();
