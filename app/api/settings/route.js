import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

// This automatically looks for KV_REST_API_URL and KV_REST_API_TOKEN
const redis = Redis.fromEnv();
export const dynamic = 'force-dynamic'; // This stops Next.js from caching the GET request

export async function GET() {
  try {
    const data = await redis.get('youth_home_config');
    return NextResponse.json(data || {});
  } catch (error) {
    console.error("Redis Fetch Error:", error);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    // We store everything in one JSON object under the key 'youth_home_config'
    await redis.set('youth_home_config', body);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Redis Save Error:", error);
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}