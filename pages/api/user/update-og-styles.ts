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

    const {
      backgroundType,
      backgroundColor,
      backgroundGradient,
      textColor,
      accentColor,
      showAvatar,
      showStats,
      backgroundOpacity,
    } = req.body;

    const updatedUser = await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        ogStyles: {
          backgroundType,
          backgroundColor,
          backgroundGradient,
          textColor,
          accentColor,
          showAvatar,
          showStats,
          backgroundOpacity,
        },
      },
      select: {
        id: true,
        handle: true,
        ogStyles: true,
      },
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating OG styles:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
