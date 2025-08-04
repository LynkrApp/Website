import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { db } from '@/lib/db';
import { nanoid } from 'nanoid';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session?.user?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { provider } = req.body;

    if (!provider) {
      return res.status(400).json({ message: 'Provider is required' });
    }

    // Generate a secure token that expires in 5 minutes
    const token = nanoid(32);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store the linking token in the database
    await db.linkingToken.create({
      data: {
        token,
        userId: session.user.id,
        provider,
        expiresAt,
      },
    });

    return res.status(200).json({ token });
  } catch (error) {
    console.error('Error creating link token:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
