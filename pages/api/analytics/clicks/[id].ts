import { db } from '@/lib/db';
import { UAParser } from 'ua-parser-js';
import { getClientIp } from 'request-ip';
import { getLocationFromIp } from '@/utils/geo-service';

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return res.status(405).end();
  }

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Link ID is required' });
    }

    // Find the link to ensure it exists
    const link = await db.link.findUnique({
      where: { id },
    });

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    // Increment the clicks count on the link
    await db.link.update({
      where: { id },
      data: { clicks: { increment: 1 } },
    });

    // Extract client information
    const userAgent = req.headers['user-agent'];
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

    // Record detailed click analytics
    await db.linkClick.create({
      data: {
        linkId: id,
        timestamp: new Date(),
        referer: req.headers.referer,
        userAgent,
        ipAddress: clientIp,
        country: locationData?.country || null,
        device,
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Click tracking error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
