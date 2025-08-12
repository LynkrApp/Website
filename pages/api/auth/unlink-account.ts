import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { db } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session?.user?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Handle provider from either query params or request body
    const provider = req.query.provider || req.body?.provider;

    if (!provider) {
      return res.status(400).json({ message: 'Provider is required' });
    }

    // Check if user has more than one linked account
    const linkedAccountsCount = await db.account.count({
      where: {
        userId: session.user.id,
      },
    });

    if (linkedAccountsCount <= 1) {
      return res.status(400).json({ 
        message: 'Cannot unlink the last remaining account' 
      });
    }

    // Delete the account
    const deletedAccount = await db.account.deleteMany({
      where: {
        userId: session.user.id,
        provider: provider,
      },
    });

    if (deletedAccount.count === 0) {
      return res.status(404).json({ message: 'Account not found' });
    }

    return res.status(200).json({ message: 'Account unlinked successfully' });
  } catch (error) {
    console.error('Error unlinking account:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
