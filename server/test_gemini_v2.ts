import { model } from "./configs/gemini.js";
import 'dotenv/config';

async function testGemini() {
    console.log("⏳ [TEST] Sending request to Gemini...");
    try {
        const prompt = "Please respond with exactly 'CONNECTION_SUCCESSFUL'";
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
        });

        const text = result.response.text();
        console.log("✅ [TEST] Gemini Response:", text);

        if (text.includes('CONNECTION_SUCCESSFUL')) {
            console.log("⭐ [SUCCESS] Gemini is fully operational!");
        }
    } catch (error: any) {
        console.error("❌ [TEST] Gemini API Failed!");
        console.error("   Error Name:", error.name);
        console.error("   Error Message:", error.message);
        if (error.status) console.error("   Status Code:", error.status);
    }
}

testGemini();
