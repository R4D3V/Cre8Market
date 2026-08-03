import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { getAdminUserByEmail, getUserByPhone } from "./db/queries";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: "admin-credentials",
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const admin = await getAdminUserByEmail(credentials.email as string);
        if (!admin) return null;

        const valid = await bcrypt.compare(credentials.password as string, admin.password_hash);
        if (!valid) return null;

        return {
          id: admin.id,
          email: admin.email,
          name: admin.name ?? "Admin",
          phone: admin.phone ?? null,
          whatsapp: admin.whatsapp ?? null,
          role: "admin" as const,
        };
      },
    }),
    Credentials({
      id: "user-credentials",
      name: "User",
      credentials: {
        phone: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.password) return null;

        const user = await getUserByPhone(credentials.phone as string);
        if (!user) return null;
        if (!user.is_active) return null;

        const valid = await bcrypt.compare(credentials.password as string, user.password_hash);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          phone: user.phone,
          whatsapp: user.whatsapp ?? user.phone,
          role: user.is_admin ? ("admin" as const) : ("user" as const),
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.phone = user.phone ?? null;
        token.whatsapp = user.whatsapp ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "admin" | "user";
        session.user.phone = token.phone as string | null | undefined;
        session.user.whatsapp = token.whatsapp as string | null | undefined;
      }
      return session;
    },
  },
});
