import {NextResponse} from 'next/server';

/**
 * Extract HTML starting from the first detected tag.
 * It looks for <html>, <div>, or any other tag if the specific ones aren't found.
 */
function extractHtml(text) {
    if (!text) return "";

    // 1. Search for common starting points
    const lowerText = text.toLowerCase();
    const markers = ["<html", "<div", "<table", "<section"];

    let firstIndex = -1;

    for (const marker of markers) {
        const index = lowerText.indexOf(marker);
        if (index !== -1 && (firstIndex === -1 || index < firstIndex)) {
            firstIndex = index;
        }
    }

    // 2. Fallback: If no common tags, just find the very first '<'
    if (firstIndex === -1) {
        firstIndex = text.indexOf('<');
    }

    if (firstIndex !== -1) {
        // Cut everything before the tag
        let cleanHtml = text.substring(firstIndex).trim();

        // 3. Cleanup Markdown: Remove closing backticks if they exist at the end
        // This handles cases like: <div>...</div>```
        cleanHtml = cleanHtml.replace(/```\s*$/g, "").trim();

        return cleanHtml;
    }

    // If no tag found at all, return the original trimmed text
    return text.trim();
}

export async function POST(req) {
    const logPrefix = `[${new Date().toLocaleTimeString()}] 🤖 [Gemini API]`;
    const GEMINI_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    try {
        const {customRequest, currentText} = await req.json();

        if (!GEMINI_KEY) {
            console.error(`${logPrefix} ❌ API Key manquante.`);
            return NextResponse.json({error: 'API Key missing'}, {status: 500});
        }

        // --- PRIORITÉ : Gemini 1.5 uniquement ---
        const priorityModels = [
            {id: "gemini-1.5-flash", version: "v1beta"},
            {id: "gemini-1.5-pro", version: "v1beta"}
        ];

        let discoveredModels = [];
        try {
            const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_KEY}`);
            const listData = await listRes.json();
            if (listData.models) {
                discoveredModels = listData.models
                    .filter(m =>
                        m.supportedGenerationMethods.includes('generateContent') &&
                        !m.name.toLowerCase().includes('gemma') // STRICT FILTER: REMOVE GEMMA
                    )
                    .map(m => ({id: m.name.split('/').pop(), version: 'v1beta'}));
            }
        } catch (e) {
            console.warn(`${logPrefix} ⚠️ Échec de découverte dynamique.`);
        }

        // Merge and remove duplicates
        const allModels = [...priorityModels, ...discoveredModels].filter((v, i, a) =>
            a.findIndex(t => t.id === v.id) === i
        );

        let lastError = "";

        for (const model of allModels) {
            try {
                console.log(`${logPrefix} 🚀 Tentative avec : ${model.id}`);

                // Standardized prompt for high-quality Gemini models
                const finalPrompt = `Task: ${customRequest}\n\nContent: ${currentText}`;

                const response = await fetch(`https://generativelanguage.googleapis.com/${model.version}/models/${model.id}:generateContent?key=${GEMINI_KEY}`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        contents: [{parts: [{text: finalPrompt}]}],
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 4000,
                        }
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    // console.log("Gemini Debug:", {
                    //     request: customRequest,
                    //     length: currentText?.length,
                    //     final: finalPrompt
                    // });
                    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
                    // console.log('-----------')
                    // console.log(rawText)
                    // console.log('-----------')
                    if (rawText && rawText.trim().length > 20) {
                        const generatedText = extractHtml(rawText);
                        // console.log(generatedText)
                        // console.log('-----------')
                        // console.log(`${logPrefix} ✅ SUCCÈS (${model.id})`);
                        return NextResponse.json({
                            text: generatedText,
                            model: model.id
                        });
                    } else {
                        console.warn(`${logPrefix} ⚠️ Résultat trop court, passage au suivant.`);
                    }
                }

                lastError = data.error?.message || "Réponse vide";
                console.warn(`${logPrefix} ❌ Échec ${model.id} : ${lastError}`);
            } catch
                (err) {
                lastError = err.message;
            }
        }

        return NextResponse.json({error: "Tous les modèles ont échoué", details: lastError}, {status: 500});

    } catch
        (error) {
        console.error(`${logPrefix} 💀 ERREUR FATALE :`, error);
        return NextResponse.json({error: 'Fatal Error', details: error.message}, {status: 500});
    }
}