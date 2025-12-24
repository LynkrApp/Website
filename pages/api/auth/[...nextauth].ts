import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import DiscordProvider from 'next-auth/providers/discord';
import { db } from '@/lib/db';
import NextAuth from 'next-auth/next';
import type { AuthOptions, SessionStrategy } from 'next-auth';
import { nanoid } from 'nanoid';

// Cleanup function for expired tokens and global data
async function cleanupExpiredTokens() {
  try {
    // Clean up expired tokens from database
    await db.linkingToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });

    // Clean up expired data from global storage
    if (global.pendingAccountLinks) {
      const expiredTokens = [];
      for (const [token, data] of Object.entries(global.pendingAccountLinks)) {
        const tokenInDb = await db.linkingToken.findUnique({
          where: { token },
        });
        if (!tokenInDb) {
          expiredTokens.push(token);
        }
      }

      expiredTokens.forEach((token) => {
        delete global.pendingAccountLinks[token];
        delete global.accountLinkingRedirects?.[token];
      });
    }
  } catch (error) {
    console.error('Error cleaning up expired tokens:', error);
  }
}

// Run cleanup every 5 minutes in development, less frequently in production
if (!global.cleanupInterval) {
  const interval =
    process.env.NODE_ENV === 'development' ? 5 * 60 * 1000 : 30 * 60 * 1000;
  global.cleanupInterval = setInterval(cleanupExpiredTokens, interval);
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt' as SessionStrategy,
  },
  pages: {
    newUser: '/new-user',
    signIn: '/login',
    error: '/login',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account && account.type === 'oauth') {
        const userEmail = user?.email || profile?.email;

        if (!userEmail) {
          return false;
        }

        const existingUser = await db.user.findUnique({
          where: { email: userEmail },
          include: { accounts: true },
        });

        if (existingUser) {
          const hasThisProvider = existingUser.accounts.some(
            (acc) => acc.provider === account.provider
          );
          if (hasThisProvider) {
            const isBanned = existingUser.accounts.some((acc) => acc.isBanned);
            if (isBanned) {
              return false;
            }
            return true;
          }
        }

        if (existingUser) {
          const activeTokens = await db.linkingToken.findMany({
            where: {
              provider: account.provider,
              userId: existingUser.id,
              expiresAt: { gt: new Date() },
            },
            orderBy: {
              createdAt: 'desc',
            },
          });

          if (activeTokens.length > 0) {
            if (global.pendingAccountLinks) {
              for (const [token, data] of Object.entries(
                global.pendingAccountLinks
              )) {
                const tokenExists = activeTokens.find((t) => t.token === token);
                if (!tokenExists) {
                  delete global.pendingAccountLinks[token];
                  delete global.accountLinkingRedirects?.[token];
                }
              }
            }

            const matchingToken = activeTokens[0];

            global.pendingAccountLinks = global.pendingAccountLinks || {};
            global.pendingAccountLinks[matchingToken.token] = {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              accountData: {
                type: account.type,
                refresh_token: account.refresh_token,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state,
              },
            };

            return true;
          }

          return true;
        }

        return true;
      }

      return true;
    },

    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.handle = token.handle;
        session.user.isBanned = token.isBanned;
        session.user.role = token.role;
      }
      return session;
    },

    async jwt({ token, user, account }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
        include: {
          accounts: true,
        },
      });

      if (!dbUser) {
        token.id = user.id;
        return token;
      }

      // Remove the automatic handle assignment
      // Only set handle if it already exists in the database
      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        handle: dbUser.handle, // This will be undefined for new users, which is what we want
        buttonStyle: dbUser.buttonStyle,
        themePalette: dbUser.themePalette,
        isBanned: dbUser.accounts.some((acc) => acc.isBanned),
        role: dbUser.accounts.some((acc) => acc.userRole === 'SUPERADMIN')
          ? 'SUPERADMIN'
          : dbUser.accounts.some((acc) => acc.userRole === 'ADMIN')
          ? 'ADMIN'
          : 'USER',
      };
    },

    redirect({ url, baseUrl }) {
      if (
        url.includes('/admin/settings') &&
        url.includes('tab=accounts') &&
        url.includes('action=complete')
      ) {
        return url.startsWith('http') ? url : `${baseUrl}${url}`;
      }

      if (url.includes('/admin/settings') && url.includes('tab=accounts')) {
        return url.startsWith('http') ? url : `${baseUrl}${url}`;
      }

      if (url.includes('error=')) {
        return `${baseUrl}/login`;
      }

      if (url.startsWith(baseUrl) && !url.includes('error=')) {
        return url;
      }

      return `${baseUrl}/admin`;
    },
  },
};

export default NextAuth(authOptions);
