import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

const redis = Redis.fromEnv();
export const dynamic = 'force-dynamic';

// 1. Get the Client ID from the environment
const clientId = process.env.NEXT_PUBLIC_CLIENT_ID || 'default';

// 2. Create a dynamic key name (e.g., "beithanoar_home_config")
const STORAGE_KEY = `${clientId}_config`;

export async function GET() {
  try {
    // Log for debugging in Vercel dashboard
    console.log(`[Redis] Fetching data for key: ${STORAGE_KEY}`);

    const data = await redis.get(STORAGE_KEY);
    return NextResponse.json(data || {});
  } catch (error) {
    console.error(`Redis Fetch Error (${STORAGE_KEY}):`, error);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    console.log(`[Redis] Saving data to key: ${STORAGE_KEY}`);

    // Store data under the company-specific key
    await redis.set(STORAGE_KEY, body);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Redis Save Error (${STORAGE_KEY}):`, error);
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}