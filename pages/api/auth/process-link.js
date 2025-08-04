import { getServerSession } from 'next-auth';
import { authOptions } from './[...nextauth]';
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

    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
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

    // Check for pending account link data stored during signIn callback
    const pendingAccountLink = global.pendingAccountLinks?.[token];
    
    console.log('Checking for pending account link data for token:', token);
    console.log('Available tokens:', Object.keys(global.pendingAccountLinks || {}));
    console.log('Pending account link:', pendingAccountLink);
    
    if (!pendingAccountLink || pendingAccountLink.provider !== linkingToken.provider) {
      return res.status(400).json({ 
        message: 'No pending account link data found or provider mismatch',
        debug: {
          hasPendingData: !!pendingAccountLink,
          expectedProvider: linkingToken.provider,
          actualProvider: pendingAccountLink?.provider
        }
      });
    }

    const { provider, providerAccountId, accountData } = pendingAccountLink;

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
      // Clean up pending data
      delete global.pendingAccountLinks[token];
      return res.status(400).json({ 
        message: 'This account is already linked to another user' 
      });
    }

    if (existingAccount && existingAccount.userId === session.user.id) {
      // Account is already linked to this user - clean up and return success
      try {
        await db.linkingToken.delete({ where: { token } });
      } catch (error) {
        console.log('Token already deleted:', token);
      }
      // Clean up pending data
      delete global.pendingAccountLinks[token];
      return res.status(200).json({ 
        message: 'Account linked successfully' 
      });
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

    // Clean up the linking token and pending data
    try {
      await db.linkingToken.delete({ where: { token } });
    } catch (error) {
      // Token might already be deleted - this is okay in account linking scenarios
      console.log('Token already deleted or not found:', token);
    }
    delete global.pendingAccountLinks[token];

    return res.status(200).json({ message: 'Account linked successfully' });
  } catch (error) {
    console.error('Error processing account link:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
