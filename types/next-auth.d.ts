import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "admin" | "user";
      phone?: string | null;
      whatsapp?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: "admin" | "user";
    phone?: string | null;
    whatsapp?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "admin" | "user";
    phone?: string | null;
    whatsapp?: string | null;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: "admin" | "user";
    phone?: string | null;
    whatsapp?: string | null;
  }
}
