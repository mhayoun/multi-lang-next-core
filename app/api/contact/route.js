import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, phone, email, message } = body;

        // 1. Clean the URL (removes trailing slash if it exists)
        let url = process.env.KV_REST_API_URL;
        if (url && url.endsWith('/')) url = url.slice(0, -1);

        const token = process.env.KV_REST_API_TOKEN;

        if (!url || !token) {
            console.error("CRITICAL: Upstash keys are missing in .env.local");
            return NextResponse.json({ error: 'Config missing' }, { status: 500 });
        }

        // 2. The Fetch call
        const response = await fetch(`${url}/lpush/site_messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: Date.now().toString(),
                name,
                phone,
                email,
                message,
                timestamp: new Date().toISOString(),
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error("Upstash API refused the request:", result);
            return NextResponse.json({ error: 'Upstash Refused' }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        // This will print the EXACT error in your Terminal/Vercel logs
        console.error("Detailed API Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}