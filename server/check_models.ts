import 'dotenv/config';

async function listAllModels() {
    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

    console.log("⏳ Fetching exact supported model names...");
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.models) {
            console.log("✅ Available Models:");
            data.models.forEach((m: any) => console.log(` - ${m.name}`));
        } else {
            console.error("❌ No models found or error:", data);
        }
    } catch (err) {
        console.error("❌ Fetch failed:", err);
    }
}

listAllModels();
