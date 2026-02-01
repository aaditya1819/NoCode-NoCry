import { generateWebsiteCode } from "./lib/aiService.js";
import 'dotenv/config';

async function testFormat() {
    console.log("⏳ Testing new section-based AI response...");
    try {
        const res = await generateWebsiteCode("Create a simple landing page for a coffee shop");
        console.log("EXPLANATION:", res.explanation);
        console.log("CODE PREVIEW:", res.code.substring(0, 100));
        if (res.code.includes("\\n")) {
            console.error("❌ FAILED: Literal \\n found in code!");
        } else {
            console.log("✅ SUCCESS: No literal \\n found.");
        }
    } catch (e: any) {
        console.error("❌ Test failed:", e.message);
    }
}

testFormat();
