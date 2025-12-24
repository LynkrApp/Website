import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import serverAuth from '@/lib/serverAuth';
import { UserRole } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { currentUser } = await serverAuth(req, res);

    const isAuthorized = currentUser.accounts.some(
      (acc: any) => acc.userRole === UserRole.SUPERADMIN || acc.userRole === UserRole.ADMIN
    );

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        handle: true,
        image: true,
        email: true,
        createdAt: true,
        accounts: {
          select: {
            userRole: true,
            isBanned: true,
          },
        },
        _count: {
          select: {
            links: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedUsers = users.map((user) => {
      // Determine role (highest role)
      const role = user.accounts.some((acc) => acc.userRole === UserRole.SUPERADMIN)
        ? UserRole.SUPERADMIN
        : user.accounts.some((acc) => acc.userRole === UserRole.ADMIN)
        ? UserRole.ADMIN
        : UserRole.USER;

      const isBanned = user.accounts.some((acc) => acc.isBanned);

      return {
        id: user.id,
        name: user.name,
        handle: user.handle,
        image: user.image,
        email: user.email,
        createdAt: user.createdAt,
        role,
        isBanned,
        linkCount: user._count.links,
      };
    });

    return res.status(200).json(formattedUsers);
  } catch (error: any) {
    console.error('USERS_API_ERROR:', error);
    return res.status(error.message === 'Not signed in' ? 401 : 500).json({
      message: error.message || 'Internal server error',
    });
  }
}
