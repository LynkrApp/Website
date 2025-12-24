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

    const isSuperAdmin = currentUser.accounts.some(
      (acc: any) => acc.userRole === UserRole.SUPERADMIN
    );

    if (!isSuperAdmin) {
      return res.status(403).json({ message: 'Only Super Admins can promote users' });
    }

    const { userId, role } = req.body;

    if (!userId || !role) {
      return res.status(400).json({ message: 'Missing userId or role' });
    }

    if (!Object.values(UserRole).includes(role as UserRole)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Update all accounts for this user to ensure role is applied globally
    await db.account.updateMany({
      where: { userId },
      data: { userRole: role as UserRole },
    });

    return res.status(200).json({ 
      message: `User role updated to ${role} successfully`,
      userId,
      role
    });
  } catch (error: any) {
    console.error('PROMOTE_API_ERROR:', error);
    return res.status(error.message === 'Not signed in' ? 401 : 500).json({ 
      message: error.message || 'Internal server error' 
    });
  }
}
