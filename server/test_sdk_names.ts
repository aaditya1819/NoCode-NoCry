import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';

async function testSDK() {
    const key = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(key || "");

    // Testing different name variations
    const names = ["gemini-1.5-flash", "gemini-flash-latest", "gemini-1.5-pro"];

    for (const name of names) {
        console.log(`⏳ Testing SDK with model: ${name}`);
        try {
            const model = genAI.getGenerativeModel({ model: name });
            const result = await model.generateContent("Say 'SDK_SUCCESS'");
            console.log(`✅ Success with ${name}: ${result.response.text()}`);
            return name; // Found one!
        } catch (err: any) {
            console.warn(`❌ Failed with ${name}: ${err.message}`);
        }
    }
}

testSDK();
