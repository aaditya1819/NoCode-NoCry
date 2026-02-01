import 'dotenv/config';

async function rawFetchTest() {
    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;

    console.log("⏳ [FETCH] Testing raw API call...");
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Hello" }] }]
            })
        });

        const data = await res.json();
        console.log(`📡 [FETCH] Status: ${res.status}`);
        console.log("📝 [FETCH] Payload:", JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("❌ [FETCH] Network error:", err);
    }
}

rawFetchTest();
