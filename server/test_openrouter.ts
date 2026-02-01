import 'dotenv/config';

async function testOpenRouter() {
    const key = process.env.AI_API_KEY; // The OpenRouter key
    console.log("⏳ Testing OpenRouter API...");
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${key}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "google/gemini-flash-1.5",
                messages: [{ role: "user", content: "Say hi" }]
            })
        });
        const data = await response.json();
        console.log("📡 OpenRouter Response:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("❌ OpenRouter Failed:", e);
    }
}

testOpenRouter();
