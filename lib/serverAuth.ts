import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';
import { db } from './db';

const serverAuth = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = (await getServerSession(req, res, authOptions as any)) as any;

  if (!session?.user?.email) {
    throw new Error('Not signed in');
  }

  const currentUser = await db.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
      accounts: true,
    },
  });

  if (!currentUser) {
    throw new Error('Not signed in');
  }

  return { currentUser };
};

export default serverAuth;
