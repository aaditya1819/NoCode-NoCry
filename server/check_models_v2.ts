import 'dotenv/config';

async function listGeminiModels() {
    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.models) {
            const geminiModels = data.models
                .map((m: any) => m.name)
                .filter((name: string) => name.includes('gemini'));
            console.log("✅ Current Supported Gemini Models:");
            geminiModels.forEach((m: any) => console.log(m));
        } else {
            console.error("❌ Error response:", data);
        }
    } catch (err) {
        console.error("❌ Fetch failed:", err);
    }
}

listGeminiModels();
