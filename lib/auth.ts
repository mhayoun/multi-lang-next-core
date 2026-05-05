import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
});

export const authOptions: NextAuthOptions = {
    // In v4, use the @next-auth version of the adapter
    adapter: UpstashRedisAdapter(redis) as any,
    providers: [
        GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
        })
    ],
    secret: process.env.AUTH_SECRET,
    callbacks: {
        async signIn({ user }) {
            const allowedEmails = [
                "yelotag@gmail.com",
                "work2gs@gmail.com",
                "joetiger05@gmail.com",
                "info@beithanoar.org.il"
            ];

            const email = user.email?.toLowerCase().trim();
            if (!email) return false;

            return allowedEmails.includes(email);
        },
        // Recommended: Add session callback to pass user ID if needed
        async session({ session, user }) {
            if (session.user) {
                (session.user as any).id = user.id;
            }
            return session;
        }
    },
    pages: {
        signIn: '/auth/signin', // Optional: your custom sign-in page
    }
};

// Default export for utility if needed
export default NextAuth(authOptions);