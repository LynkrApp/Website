import { db } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

// This is an internal API endpoint that will be called by our edge functions
// It runs in a Node.js environment where Prisma works normally
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Simple API key validation
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== (process.env.INTERNAL_API_KEY || 'internal-api-access')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { handle, og, includeAnalytics } = req.query as {
    handle?: string;
    og?: string;
    includeAnalytics?: string;
  };

  if (!handle) {
    return res.status(400).json({ error: 'Handle parameter is required' });
  }

  try {
    // Base query to get user by handle
    const userQuery: any = {
      where: { handle },
      select: {
        id: true,
        name: true,
        handle: true,
        bio: true,
        image: true,
        totalViews: true,
        themePalette: true,
        ogStyles: true,
      },
    };

    // If og=true, include links for count
    if (og === 'true') {
      userQuery.select.links = {
        where: { archived: false },
        select: {
          id: true,
          title: true,
          url: true,
          clicks: true,
        },
      };
    }

    // If includeAnalytics=true, add more detailed analytics data
    if (includeAnalytics === 'true') {
      userQuery.select._count = {
        select: {
          pageViews: true,
        },
      };
    }

    const user = await db.user.findUnique(userQuery as any);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
