import { model } from "./configs/gemini.js";
import 'dotenv/config';

async function heavyTest() {
    console.log("🔥 Running Heavy Usage Test for Dashboard Verification...");
    const prompts = [
        "Create a simple hero section for a bakery.",
        "Generate a pricing table with three tiers.",
        "Write a contact form in HTML and Tailwind."
    ];

    for (const p of prompts) {
        console.log(`📡 Sending prompt: ${p}`);
        try {
            await model.generateContent(p);
            console.log("✅ Success.");
        } catch (e: any) {
            console.error(`❌ Failed: ${e.message}`);
        }
    }
}

heavyTest();
