// app/admin/page.jsx
'use client'; // This tells Next.js this is a browser-side component
import AdminInterface from '@/components/AdminInterface';

export default function AdminPage() {
  // Eventually, we will put the Google Auth check here
  return <AdminInterface />;
}