import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { db } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session?.user?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const linkedAccounts = await db.account.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        provider: true,
        providerAccountId: true,
        type: true,
        id: true,
      },
      orderBy: {
        id: 'asc', // MongoDB ObjectId includes timestamp, so this orders by creation time
      },
    });

    return res.status(200).json(linkedAccounts);
  } catch (error) {
    console.error('Error fetching linked accounts:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
