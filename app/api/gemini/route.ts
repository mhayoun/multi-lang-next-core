import {NextResponse} from 'next/server';

export async function POST(req) {
    try {
        const {customRequest, currentText} = await req.json();
        const GEMINI_KEY = process.env.GEMINI_API_KEY;

        if (!GEMINI_KEY) {
            return NextResponse.json({error: 'API Key missing'}, {status: 500});
        }

        // 1. DYNAMIC DISCOVERY (Enhanced for 2026)
        const listUrl = `https://generativelanguage.googleapis.com/v1/models?key=${GEMINI_KEY}`;
        const listResponse = await fetch(listUrl);
        const listData = await listResponse.json();

        let candidates = [];

        if (listData.models) {
            candidates = listData.models
                .filter(m => m.supportedGenerationMethods.includes("generateContent"))
                .map(m => m.name.split('/').pop()); // Extract ID like 'gemini-2.5-flash'
        }

        // 2. HARD-CODED FALLBACKS (The 2026 "Standard" list)
        // If discovery fails, we manually try the current April 2026 aliases
        const fallbacks = [
            "gemini-2.5-flash",
            "gemini-3.1-flash-lite",
            "gemini-flash-latest",
            "gemini-2.0-flash",
            "gemini-pro-3.1"
        ];

        // Combine discovery with fallbacks, removing duplicates
        const modelsToTry = [...new Set([...candidates, ...fallbacks])].slice(0, 5);

        let lastError = null;

        for (const modelName of modelsToTry) {
            try {
                console.log(`🚀 Trying: ${modelName}`);
                const API_URL = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${GEMINI_KEY}`;

                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        contents: [{parts: [{text: `Task: ${customRequest}\nContent: ${currentText}`}]}]
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    console.log(`✅ SUCCESS: Model [${modelName}] is active.`);
                    return NextResponse.json(data);
                }

                lastError = data.error?.message || "Unknown error";
                console.warn(`❌ FAIL [${modelName}]: ${lastError}`);

                // If the key itself is dead, stop immediately
                // Add (lastError as any) or (lastError as string) to bypass the 'never' check
                if ((lastError as any)?.toString().toLowerCase().includes("api_key") || response.status === 401) {
                    return NextResponse.json({error: "Invalid API Key"}, {status: 401});
                }

            } catch (err) {
                lastError = err.message;
            }
        }

        return NextResponse.json({
            error: "Regional Outage or Deprecated Models",
            details: lastError
        }, {status: 500});

    } catch (error) {
        return NextResponse.json({error: 'Server Error'}, {status: 500});
    }
}