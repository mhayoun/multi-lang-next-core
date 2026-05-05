import {useState} from 'react';

// This file handles the AI interaction, clipboard operations, and backup/restore logic.

export const useSubMenuActions = (logic, isHe, sub) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isGeminiGenerating, setIsGeminiGenerating] = useState(false); // New state for Gemini
    const [isProcessingFile, setIsProcessingFile] = useState(false);
    const [statusMsg, setStatusMsg] = useState(null);
    const [backupContent, setBackupContent] = useState(null);

    const showStatus = (type) => {
        setStatusMsg(type);
        setTimeout(() => setStatusMsg(null), 3000);
    };

    /**
     * Helper to strip markdown code blocks and unwanted tags from AI response
     */
    const cleanAIResponse = (rawHtml) => {
        if (!rawHtml) return '';
        return rawHtml
            .replace(/```html|```/g, '')
            .replace(/<\/?(html|head|body)[^>]*>/gi, '')
            .trim();
    };

    const handleAIGenerate = async (customRequest) => {
        const currentText = sub.content?.[logic.modalLang] || '';
        if (!currentText.trim() || isGenerating) return;

        setBackupContent(currentText);
        setIsGenerating(true);

        try {
            const GROQ_KEY = process.env.NEXT_PUBLIC_GROQ_KEY;
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: 'POST',
                headers: {'Authorization': `Bearer ${GROQ_KEY}`, 'Content-Type': 'application/json'},
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        {role: "system", content: "Return ONLY clean HTML body content."},
                        {role: "user", content: `Task: ${customRequest}\n\nContent: ${currentText}`}
                    ]
                })
            });

            const data = await response.json();
            const rawHtml = data.choices?.[0]?.message?.content;
            if (rawHtml) {
                logic.handleUpdateField('content', logic.modalLang, cleanAIResponse(rawHtml));
            }
        } catch (error) {
            alert(isHe ? "שגיאה בחיבור ל-AI" : "AI Connection Error");
        } finally {
            setIsGenerating(false);
        }
    };

    /**
     * NEW: Gemini AI Interaction
     */
    const handleGeminiGenerate = async (customRequest) => {
        const currentText = sub.content?.[logic.modalLang] || '';
        if (!currentText.trim() || isGeminiGenerating) return;

        setBackupContent(currentText);
        setIsGeminiGenerating(true);

        try {
            // Point to your local API route
            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    customRequest,
                    currentText
                })
            });

            const data = await response.json();

            if (!response.ok) {
                // Stringify the data so you can see the actual Google error code/message
                const errorMsg = typeof data.error === 'object'
                    ? JSON.stringify(data.error)
                    : (data.error || 'Failed to generate');

                throw new Error(errorMsg);
            }

            // Gemini response structure: candidates[0].content.parts[0].text
            const rawHtml = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (rawHtml) {
                logic.handleUpdateField('content', logic.modalLang, cleanAIResponse(rawHtml));
            }
        } catch (error) {
            console.error("Gemini Error:", error);
            alert(isHe ? "שגיאה בחיבור ל-Gemini" : "Gemini Connection Error");
        } finally {
            setIsGeminiGenerating(false);
        }
    };

    const processFileToHtml = async (file, action, additionalParam) => {
        if (!file) return;
        setIsProcessingFile(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const result = await action(formData, additionalParam);
            if (result.html) {
                await navigator.clipboard.writeText(result.html);
                showStatus('success');
            }
        } catch (e) {
            alert(isHe ? "שגיאה בעיבוד הקובץ" : "File processing error");
        } finally {
            setIsProcessingFile(false);
        }
    };

    return {
        isGenerating,
        isGeminiGenerating,
        isProcessingFile,
        statusMsg,
        backupContent,
        handleAIGenerate,
        handleGeminiGenerate,
        processFileToHtml,
        handleRestore: () => {
            logic.handleUpdateField('content', logic.modalLang, backupContent);
            setBackupContent(null);
        }
    };
};