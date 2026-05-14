import { NextResponse } from 'next/server';
import { getClientSettings } from '@/lib/settings';
import { Redis } from '@upstash/redis';

// Initialize Redis only for the POST method here
const redis = Redis.fromEnv();

export const dynamic = 'force-dynamic';

// 1. Get the Client ID from the environment
const clientId = process.env.NEXT_PUBLIC_CLIENT_ID || 'default';
const STORAGE_KEY = `${clientId}_config`;

/**
 * GET Handler
 * Uses the shared library to fetch data.
 */
export async function GET() {
    try {
        console.log(`[API GET] Fetching settings for: ${clientId}`);

        // Use the library function instead of direct redis.get
        const data = await getClientSettings(clientId);

        return NextResponse.json(data || {});
    } catch (error) {
        console.error(`[API GET Error]:`, error);
        return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
    }
}

/**
 * POST Handler
 * Updates the data in Redis.
 */
export async function POST(request) {
    try {
        const body = await request.json();

        console.log(`[API POST] Saving data to key: ${STORAGE_KEY}`);

        // Store data under the company-specific key
        await redis.set(STORAGE_KEY, body);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(`[API POST Error] (${STORAGE_KEY}):`, error);
        return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
    }
}