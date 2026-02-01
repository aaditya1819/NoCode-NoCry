import { model } from "../configs/gemini.js";

/**
 * Enhanced AI generation using Google AI Studio
 * Uses a robust custom delimiter format instead of JSON to avoid escaping issues with long HTML.
 */
export async function generateWebsiteCode(prompt: string, isInitial: boolean = false) {
    console.log(`🚀 [AI] Requesting interactive response from Google AI Studio...`);

    const systemPrompt = `You are "SiteBuilder AI", an expert web developer.
Generate a stunning, modern website using HTML, Tailwind CSS, and JavaScript.

INSTRUCTIONS:
1. Be professional and proactive.
2. Suggest a specific next step at the end.

RESPONSE FORMAT (STRICT):
You must format your response EXACTLY like this:

[EXPLANATION]
Write 2-3 friendly sentences about what you built/changed.

[CODE]
<complete html code here>

Do NOT use any markdown code blocks (like \`\`\`html). 
Just give me the raw text for each section.`;

    try {
        const start = Date.now();
        const result = await model.generateContent(`${systemPrompt}\n\nUSER REQUEST: "${prompt}"`);
        const text = result.response.text();
        const duration = ((Date.now() - start) / 1000).toFixed(2);

        // Parse the response using sections
        let explanation = "I've processed your request and updated the website code for you.";
        let code = "";

        if (text.includes("[EXPLANATION]") && text.includes("[CODE]")) {
            const parts = text.split("[CODE]");
            const explanationPart = parts[0].replace("[EXPLANATION]", "").trim();
            const codePart = parts[1].trim();

            explanation = explanationPart;
            code = codePart;
        } else {
            // Fallback for unexpected formats
            console.warn("⚠️ [AI] section delimiters not found, using heuristic parsing.");
            if (text.includes("<!DOCTYPE") || text.includes("<html")) {
                const codeMatch = text.match(/<html[\s\S]*<\/html>/i) || text.match(/<!DOCTYPE[\s\S]*<\/html>/i);
                code = codeMatch ? codeMatch[0] : text;
            } else {
                code = text;
            }
        }

        // AGGRESSIVE CLEANING
        // 1. Remove markdown code blocks if AI ignored instructions
        code = code.replace(/```[a-z]*\n?/gi, '').replace(/```$/g, '').trim();

        // 2. IMPORTANT: Fix escaped literal newlines like \n that showing up as text
        // This happens if the AI tries to be "helpful" or get confused by the prompt
        code = code.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\"/g, '"');

        console.log(`✅ [AI] Generation Successful! Duration: ${duration}s, Code Length: ${code.length}`);

        return { explanation, code };
    } catch (error: any) {
        console.error(`💥 [AI ERROR]: ${error.message}`);
        throw error;
    }
}
