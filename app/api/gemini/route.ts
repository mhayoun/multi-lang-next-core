import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { customRequest, currentText } = await req.json();
        // Vérifie si tu utilises GEMINI_API_KEY ou GOOGLE_GENERATIVE_AI_API_KEY dans ton .env
        const GEMINI_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

        if (!GEMINI_KEY) {
            return NextResponse.json({ error: 'API Key missing in environment' }, { status: 500 });
        }

        // Liste prioritaire des modèles en Mai 2026
        // Flash est privilégié pour éviter les timeouts et les erreurs de quota
        const modelsToTry = [
            "gemini-1.5-flash",
            "gemini-1.5-pro",
            "gemini-2.0-flash"
        ];

        let lastErrorMessage = "";

        for (const modelName of modelsToTry) {
            try {
                const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_KEY}`;

                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{ text: `Task: ${customRequest}\nContent: ${currentText}` }]
                        }],
                        // Ajout d'une configuration de sécurité pour éviter les blocages inutiles
                        safetySettings: [
                            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" }
                        ]
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    return NextResponse.json(data);
                }

                // Capture de l'erreur spécifique
                lastErrorMessage = data.error?.message || "Unknown error";

                // Si la clé est invalide, on s'arrête tout de suite
                if (response.status === 401 || lastErrorMessage.toLowerCase().includes("api_key")) {
                    return NextResponse.json({ error: "Invalid API Key" }, { status: 401 });
                }

                console.warn(`Model ${modelName} failed: ${lastErrorMessage}`);

            } catch (err) {
                lastErrorMessage = err.message;
            }
        }

        // Si on arrive ici, aucun modèle n'a fonctionné
        return NextResponse.json({
            error: "All models failed or Regional Restriction",
            details: lastErrorMessage
        }, { status: 500 });

    } catch (error) {
        console.error("Critical Server Error:", error);
        return NextResponse.json({ error: 'Server Error', details: error.message }, { status: 500 });
    }
}