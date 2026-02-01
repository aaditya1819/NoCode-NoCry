import { generateWebsiteCode } from "./lib/aiService.js";
import 'dotenv/config';

async function test() {
    console.log("⏳ Starting AI Service Test...");
    try {
        const result = await generateWebsiteCode("A simple placeholder website");
        console.log("✅ Received Code Length:", result.code.length);
    } catch (e: any) {
        console.error("❌ AI Service Failed:", e.message);
    }
}

test();
