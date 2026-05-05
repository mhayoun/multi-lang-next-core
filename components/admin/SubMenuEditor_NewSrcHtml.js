'use server'; // THIS IS THE KEY

import { put, list } from '@vercel/blob';

/**
 * SERVER ACTION
 * 1. Receives FormData (containing the file)
 * 2. Checks existence via private Server Token
 * 3. Uploads if necessary
 * 4. Returns the data to the client
 */
export const subMenuEditor_NewSrcHtml = async (formData, altText = 'image') => {
    // Extract file from FormData on the server
    const file = formData.get('file');

    if (!file) {
        throw new Error("No file provided to the server.");
    }

    const fileName = file.name;
    let latestUrl = null;

    try {
        console.log(`[Server] Checking Vercel Blob for: ${fileName}`);

        // 1. Check for existing file (Server-side call)
        const { blobs } = await list({
            prefix: fileName,
            limit: 1,
            // token: process.env.BLOB_READ_WRITE_TOKEN // Optional: Next.js picks this up automatically
        });

        const existingBlob = blobs.find(b => b.pathname === fileName);

        if (existingBlob) {
            console.log("[Server] Found existing blob. Skipping upload.");
            latestUrl = existingBlob.url;
        } else {
            // 2. Upload if not found
            console.log("[Server] Not found. Uploading new blob...");
            const newBlob = await put(fileName, file, {
                access: 'public',
                addRandomSuffix: true
            });
            latestUrl = newBlob.url;
        }

        // 3. Generate the Template
        const htmlTemplate = `
<div style="text-align: center; margin-bottom: 25px;">
    <img src="${latestUrl}" alt="${altText}" style="max-width: 100%; height: auto; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
</div>`.trim();

        return {
            html: htmlTemplate,
            url: latestUrl
        };

    } catch (error) {
        console.error("[Server Action Error]:", error.message);
        throw new Error("Failed to process image on server.");
    }
};