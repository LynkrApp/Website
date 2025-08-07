import { db } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    const { handle } = req.query;

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

    // Get all pageViews with device data
    const allPageViews = await db.pageView.findMany({
      where: {
        userId: user.id,
        device: { not: null },
      },
      select: {
        device: true,
      },
    });

    // Group by device and count occurrences
    const countByDevice = allPageViews.reduce((acc, view) => {
      acc[view.device] = (acc[view.device] || 0) + 1;
      return acc;
    }, {});

    // Convert to array and sort
    const formattedDeviceData = Object.entries(countByDevice)
      .map(([device, visits]) => ({ device, visits }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 20);

    return res.status(200).json(formattedDeviceData);
  } catch (error) {
    console.error('Device analytics error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
