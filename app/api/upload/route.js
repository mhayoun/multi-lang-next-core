import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    // 1. Validation: Ensure a filename exists
    if (!filename) {
      return NextResponse.json({ error: "Filename is required" }, { status: 400 });
    }

    // 2. Resolve the body: Convert the stream to a buffer
    // @vercel/blob handles ArrayBuffers, Blobs, and Strings much more reliably than raw streams
    const fileBuffer = await request.arrayBuffer();

    // 3. Upload to Vercel Blob
    const blob = await put(filename, fileBuffer, {
      access: 'public',
      addRandomSuffix: true,
    });

    return NextResponse.json(blob);

  } catch (error) {
    // This will catch missing environment variables (BLOB_READ_WRITE_TOKEN)
    // or storage quota issues, and send the message back to your frontend.
    console.error("Vercel Blob Upload Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}