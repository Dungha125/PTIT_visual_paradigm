import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// The following import may fail if @next-auth/prisma-adapter is not installed.
// Ensure the package is installed: npm install @next-auth/prisma-adapter
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user && token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
    redirect: async ({ url, baseUrl }) => {
      // Redirect về dashboard sau khi đăng nhập thành công
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Nếu đăng nhập thành công, redirect về dashboard
      if (url === baseUrl) return `${baseUrl}/dashboard`;
      return `${baseUrl}/dashboard`;
    },
  },
  session: {
    strategy: "jwt",
  },
};
