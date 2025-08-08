import { db } from '@/lib/db';
import { getClientIp } from 'request-ip';
import { getLocationFromIp } from '@/utils/geo-service';
import { UAParser } from 'ua-parser-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const { userId, referer } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Extract client information
    const userAgent = req.headers['user-agent'] || null;
    const clientIp = getClientIp(req);

    // Get location data
    let locationData = null;
    if (clientIp) {
      locationData = await getLocationFromIp(clientIp);
    }

    // Parse user agent for device information
    let device = 'desktop';
    if (userAgent) {
      const parser = new UAParser(userAgent);
      const deviceInfo = parser.getDevice();
      device =
        deviceInfo.type ||
        (userAgent.includes('Mobile') ? 'mobile' : 'desktop');
    }

    // Create page view with collected data
    await db.pageView.create({
      data: {
        userId,
        referer,
        userAgent,
        ipAddress: clientIp,
        country: locationData?.country || null,
        device,
      },
    });

    // Increment user's total views
    await db.user.update({
      where: { id: userId },
      data: { totalViews: { increment: 1 } },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error recording page view:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
