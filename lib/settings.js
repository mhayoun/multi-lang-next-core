import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

/**
 * Direct logic to fetch settings from Redis
 * Bypasses the network/HTTP layer entirely.
 */
export async function getClientSettings(clientId) {
    const STORAGE_KEY = `${clientId}_config`;
    try {
        console.log(`[Redis Logic] Fetching data directly for: ${STORAGE_KEY}`);
        const data = await redis.get(STORAGE_KEY);
        return data || null;
    } catch (error) {
        console.error(`[Redis Logic] Error fetching ${STORAGE_KEY}:`, error);
        return null;
    }
}