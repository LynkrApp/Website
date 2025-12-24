import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import serverAuth from '@/lib/serverAuth';
import { UserRole } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
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

    const { userId, ban } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'Missing userId' });
    }

    // Update all accounts for this user to ensure ban is applied globally
    await db.account.updateMany({
      where: { userId },
      data: { isBanned: !!ban },
    });

    return res.status(200).json({ 
      message: `User ${ban ? 'banned' : 'unbanned'} successfully`,
      userId,
      isBanned: !!ban
    });
  } catch (error: any) {
    console.error('BAN_API_ERROR:', error);
    return res.status(error.message === 'Not signed in' ? 401 : 500).json({ 
      message: error.message || 'Internal server error' 
    });
  }
}
