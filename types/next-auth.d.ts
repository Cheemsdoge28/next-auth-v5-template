import { DefaultSession, DefaultUser } from "next-auth";

// Extend the User object returned by next-auth to include role
declare module "next-auth" {
  interface User {
    id: string;
    role: string;
  }

  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    userId: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
    role: string;
  }
}
