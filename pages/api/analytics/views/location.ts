import { db } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    const { handle, period = '30d' } = req.query;

    if (!handle) {
      return res.status(400).json({ error: 'Handle is required' });
    }

    // Find user by handle
    const user = await db.user.findUnique({
      where: { handle },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Set time filter based on period
    const currentDate = new Date();
    const startDate = new Date();

    switch (period) {
      case '7d':
        startDate.setDate(currentDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(currentDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(currentDate.getDate() - 90);
        break;
      default:
        startDate.setDate(currentDate.getDate() - 30);
    }

    // Get views grouped by country
    const viewsByLocation = await db.pageView.groupBy({
      by: ['country'],
      where: {
        userId: user.id,
        timestamp: {
          gte: startDate,
          lte: currentDate,
        },
        country: {
          not: null,
        },
      },
      _count: {
        country: true,
      },
    });

    // Format the data for the frontend
    const formattedData = viewsByLocation.map((item) => ({
      location: item.country,
      visits: item._count.country,
    }));

    // Sort by number of visits (descending)
    formattedData.sort((a, b) => b.visits - a.visits);

    return res.status(200).json(formattedData);
  } catch (error) {
    console.error('Location analytics error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
