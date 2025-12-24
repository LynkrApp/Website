import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';
import { db } from './db';

const serverAuth = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = (await getServerSession(req, res, authOptions as any)) as any;

  if (!session?.user) {
    throw new Error('Not signed in');
  }

  // Prefer looking up by session user id, which should always be present
  // per our NextAuth callbacks. Fallback to email if needed.
  const userId: string | undefined = session.user.id;
  const userEmail: string | undefined = session.user.email;

  let currentUser = null;

  if (userId) {
    currentUser = await db.user.findUnique({
      where: { id: userId },
      include: {
        accounts: {
          select: {
            id: true,
            provider: true,
            userRole: true,
            isBanned: true,
          },
        },
      },
    });
  }

  if (!currentUser && userEmail) {
    currentUser = await db.user.findUnique({
      where: { email: userEmail },
      include: {
        accounts: {
          select: {
            id: true,
            provider: true,
            userRole: true,
            isBanned: true,
          },
        },
      },
    });
  }

  if (!currentUser) {
    throw new Error('Not signed in');
  }

  return { currentUser };
};

export default serverAuth;
