import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  const blob = await put(filename, request.body, {
    access: 'public',
    addRandomSuffix: true, // Option A: logo-abc123.png (Better for browser caching)
    // or
    // addRandomSuffix: false, allowOverwrite: true // Option B: Always exactly 'logo.png'
  });

  return NextResponse.json(blob);
}