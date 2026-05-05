'use server';

import { put, list } from '@vercel/blob';

export const subMenuEditor_NewPdfHtml = async (formData, buttonText = 'Download PDF') => {
    const file = formData.get('file');
    if (!file) throw new Error("No file provided");

    const fileName = file.name;
    let latestUrl = null;

    try {
        // 1. Check for existing PDF
        const { blobs } = await list({ prefix: fileName, limit: 1 });
        const existingBlob = blobs.find(b => b.pathname === fileName);

        if (existingBlob) {
            latestUrl = existingBlob.url;
        } else {
            // 2. Upload PDF
            const newBlob = await put(fileName, file, {
                access: 'public',
                addRandomSuffix: true,
                contentType: 'application/pdf' // Explicitly set for PDFs
            });
            latestUrl = newBlob.url;
        }

        // 3. Generate Button Template
        const htmlTemplate = `
<div style="margin: 20px 0; text-align: center;">
    <a href="${latestUrl}" target="_blank" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 25px; border-radius: 8px; text-decoration: none; font-weight: bold; font-family: system-ui, sans-serif; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);">
        📥 ${buttonText}
    </a>
</div>`.trim();

        return { html: htmlTemplate, url: latestUrl };
    } catch (error) {
        console.error("[Pdf Server Error]:", error);
        throw error;
    }
};