'use client'; // Indispensable ici

import { SessionProvider } from "next-auth/react";

export default function ClientProviders({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}