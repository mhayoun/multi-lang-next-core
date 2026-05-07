import {useState} from 'react';

// This file handles the AI interaction, clipboard operations, and backup/restore logic.

export const useSubMenuActions = (logic, isHe, sub, menuData) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isGeminiGenerating, setIsGeminiGenerating] = useState(false); // New state for Gemini
    const [isProcessingFile, setIsProcessingFile] = useState(false);
    const [statusMsg, setStatusMsg] = useState(null);
    const [backupContent, setBackupContent] = useState(null);
    const [selectedTemplateId, setSelectedTemplateId] = useState('');

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

    // Inside your actions definition
    const buildFinalPrompt = (customRequest) => {
        const currentText = sub.content?.[logic.modalLang] || '';
        let templateText = '';

        // 1. Resolve Template logic
        if (selectedTemplateId) {
            const targetId = String(selectedTemplateId);
            for (const menu of (menuData || [])) {
                const foundSub = menu.subItems?.find(s => String(s.id) === targetId);
                if (foundSub) {
                    templateText = foundSub.content?.[logic.modalLang] || '';
                    break;
                }
            }
        }

        // 2. Construct the exact string
        let finalRequest = `${customRequest}\n${currentText}`;
        if (templateText) {
            finalRequest += ` based on this template: ${templateText}`;
        }

        return {finalRequest, currentText};
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
        // Call the builder
        const {finalRequest, currentText} = buildFinalPrompt(customRequest);

        if (!currentText.trim() || isGeminiGenerating) return;

        setBackupContent(currentText);
        setIsGeminiGenerating(true);

        try {
            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    customRequest: finalRequest, // This now includes templates + text
                    currentText: currentText
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate');
            }

            if (data.text) {
                logic.handleUpdateField('content', logic.modalLang, cleanAIResponse(data.text));
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
        selectedTemplateId,     // Add this
        setSelectedTemplateId,  // Add this
        handleAIGenerate,
        handleGeminiGenerate,
        processFileToHtml,
        buildFinalPrompt,
        handleRestore: () => {
            logic.handleUpdateField('content', logic.modalLang, backupContent);
            setBackupContent(null);
        }
    };
};