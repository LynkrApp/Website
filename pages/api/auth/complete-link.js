import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { db } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session?.user?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { token, provider, providerAccountId, accountData } = req.body;

    if (!token || !provider || !providerAccountId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Verify the linking token
    const linkingToken = await db.linkingToken.findUnique({
      where: { token },
    });

    if (!linkingToken) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    if (linkingToken.expiresAt < new Date()) {
      // Clean up expired token
      await db.linkingToken.delete({ where: { token } });
      return res.status(400).json({ message: 'Token has expired' });
    }

    if (linkingToken.userId !== session.user.id) {
      return res.status(403).json({ message: 'Token does not belong to current user' });
    }

    if (linkingToken.provider !== provider) {
      return res.status(400).json({ message: 'Provider mismatch' });
    }

    // Check if this provider account is already linked to another user
    const existingAccount = await db.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
    });

    if (existingAccount && existingAccount.userId !== session.user.id) {
      await db.linkingToken.delete({ where: { token } });
      return res.status(400).json({ 
        message: 'This account is already linked to another user' 
      });
    }

    if (existingAccount && existingAccount.userId === session.user.id) {
      await db.linkingToken.delete({ where: { token } });
    }

    // Create the new account link
    await db.account.create({
      data: {
        userId: session.user.id,
        type: accountData.type || 'oauth',
        provider,
        providerAccountId,
        refresh_token: accountData.refresh_token,
        access_token: accountData.access_token,
        expires_at: accountData.expires_at,
        token_type: accountData.token_type,
        scope: accountData.scope,
        id_token: accountData.id_token,
        session_state: accountData.session_state,
      },
    });

    // Clean up the linking token
    await db.linkingToken.delete({ where: { token } });

    return res.status(200).json({ message: 'Account linked successfully' });
  } catch (error) {
    console.error('Error linking account:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
