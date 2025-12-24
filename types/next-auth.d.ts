import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      handle?: string;
      isBanned?: boolean;
      role?: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    handle?: string | null;
    isBanned?: boolean;
    role?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    handle?: string | null;
    name?: string | null;
    email?: string | null;
    isBanned?: boolean;
    role?: string;
  }
}



