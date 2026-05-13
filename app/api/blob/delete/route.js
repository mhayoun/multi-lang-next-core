import { del } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const urlToDelete = searchParams.get('url');

    console.log("📩 Received delete request for:", urlToDelete);

    if (!urlToDelete) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    // Verify the URL belongs to Vercel Blob to avoid errors
    if (!urlToDelete.includes('public.blob.vercel-storage.com')) {
        console.error("⚠️ Invalid Blob URL format");
        return NextResponse.json({ error: "Invalid Blob URL" }, { status: 400 });
    }

    await del(urlToDelete);

    console.log("🗑️ Successfully deleted from Vercel storage");
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("🔥 Vercel Blob Internal Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}