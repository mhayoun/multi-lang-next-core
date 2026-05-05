import { NextResponse } from 'next/server';

const url = process.env.KV_REST_API_URL;
const token = process.env.KV_REST_API_TOKEN;

// 1. GET: Fetch all messages
export async function GET() {
    try {
        const response = await fetch(`${url}/lrange/site_messages/0/-1`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to fetch');

        const data = await response.json();
        const messages = data.result.map(item =>
            typeof item === 'string' ? JSON.parse(item) : item
        );

        return NextResponse.json(messages);
    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// 2. POST: Toggle "Read" status
export async function POST(request) {
    try {
        const { id, isRead } = await request.json();

        // Fetch current list to find the item
        const res = await fetch(`${url}/lrange/site_messages/0/-1`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const list = data.result.map(item => typeof item === 'string' ? JSON.parse(item) : item);

        const index = list.findIndex(m => m.id === id);

        if (index !== -1) {
            const updatedItem = { ...list[index], isRead };
            // LSET updates a specific index in the list
            await fetch(`${url}/lset/site_messages/${index}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: JSON.stringify(updatedItem)
            });
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    } catch (error) {
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}

// 3. DELETE: Remove a message
export async function DELETE(request) {
    try {
        const { id } = await request.json();

        const res = await fetch(`${url}/lrange/site_messages/0/-1`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        // We need the EXACT string stored in Redis to use LREM
        const exactMatch = data.result.find(item => {
            const parsed = typeof item === 'string' ? JSON.parse(item) : item;
            return parsed.id === id;
        });

        if (exactMatch) {
            // LREM key count value (count 0 removes all instances of this exact value)
            await fetch(`${url}/lrem/site_messages/0`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: typeof exactMatch === 'string' ? exactMatch : JSON.stringify(exactMatch)
            });
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    } catch (error) {
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
}