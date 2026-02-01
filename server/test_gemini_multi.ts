import 'dotenv/config';

async function multiTest() {
    const key = process.env.GEMINI_API_KEY;
    const versions = ['v1', 'v1beta'];
    const models = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-pro'];

    for (const v of versions) {
        for (const m of models) {
            const url = `https://generativelanguage.googleapis.com/${v}/models/${m}:generateContent?key=${key}`;
            console.log(`⏳ Testing: ${v} / ${m}...`);
            try {
                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: "hi" }] }] })
                });
                const data = await res.json();
                console.log(`   Result: ${res.status} ${data.error ? data.error.message : 'OK'}`);
                if (res.status === 200) {
                    console.log(`⭐ SUCCESS with ${v}/${m}`);
                    return;
                }
            } catch (e) {
                console.log(`   Failed: ${e}`);
            }
        }
    }
}

multiTest();
