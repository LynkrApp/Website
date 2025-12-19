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

    const totalUsers = await db.user.count();
    const bannedUsers = await db.account.count({
      where: { isBanned: true },
    });

    // Users with at least one link
    const usersWithLinks = await db.user.count({
      where: {
        links: {
          some: {},
        },
      },
    });

    const totalViewsAcrossUsers = await db.user.aggregate({
      _sum: {
        totalViews: true,
      },
    });

    return res.status(200).json({
      totalUsers,
      usersWithLinks,
      bannedUsers,
      totalViews: totalViewsAcrossUsers._sum.totalViews || 0,
    });
  } catch (error: any) {
    console.error('STATS_API_ERROR:', error);
    return res.status(error.message === 'Not signed in' ? 401 : 500).json({
      message: error.message || 'Internal server error',
    });
  }
}
