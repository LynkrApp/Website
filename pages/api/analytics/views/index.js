import axios from 'axios';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import { UAParser } from 'ua-parser-js';

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    // For GET requests - fetch analytics data
    if (req.method === 'GET') {
      const { handle, filter } = req.query;

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

      // Get page views with time filtering
      const pageViews = await getPageViewsByDuration(user.id, filter);

      return res.status(200).json(pageViews);
    }

    // For POST requests - record a new page view
    if (req.method === 'POST') {
      const { handle } = req.body;

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

      // Parse user agent for device information
      const userAgent = req.headers['user-agent'];
      const parser = new UAParser(userAgent);
      const device = parser.getDevice().type || 'desktop';

      // Get country from headers (or use a geo-IP service)
      const country = req.headers['x-country-code'] || null;

      // Create page view entry
      await db.pageView.create({
        data: {
          userId: user.id,
          timestamp: new Date(),
          referer: req.headers.referer,
          userAgent,
          ipAddress: getClientIp(req),
          country,
          device,
        },
      });

      return res.status(200).json({ success: true });
    }
  } catch (error) {
    console.error('Analytics error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Helper function to get page views filtered by time duration
async function getPageViewsByDuration(userId, period = '24h') {
  const currentDate = new Date();
  const startDate = new Date();

  // Set time range based on filter
  switch (period) {
    case '1h':
      startDate.setHours(currentDate.getHours() - 1);
      break;
    case '24h':
    case 'last_24_hours':
      startDate.setHours(currentDate.getHours() - 24);
      break;
    case '7d':
    case 'last_7_days':
      startDate.setDate(currentDate.getDate() - 7);
      break;
    case '30d':
    case 'last_30_days':
      startDate.setDate(currentDate.getDate() - 30);
      break;
    default:
      startDate.setHours(currentDate.getHours() - 24);
  }

  // First get raw data from database
  const views = await db.pageView.findMany({
    where: {
      userId,
      timestamp: {
        gte: startDate,
        lte: currentDate,
      },
    },
    orderBy: { timestamp: 'asc' },
  });

  // Transform the data for the chart
  return transformViewsData(views, period);
}

// Helper to transform data for charts with appropriate time intervals
function transformViewsData(views, period) {
  // Group views by appropriate time intervals based on the period
  const groupedData = {};

  views.forEach((view) => {
    let key;
    const date = new Date(view.timestamp);

    if (period === '1h') {
      // Group by minutes for 1-hour view
      key = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else if (period === '24h' || period === 'last_24_hours') {
      // Group by hours for 24-hour view
      key = `${date.getHours().toString().padStart(2, '0')}:00`;
    } else {
      // Group by days for 7d and 30d views
      key = date.toISOString().split('T')[0]; // YYYY-MM-DD
    }

    if (!groupedData[key]) {
      groupedData[key] = 0;
    }
    groupedData[key]++;
  });

  // Convert to array format for charts
  return Object.keys(groupedData).map((t) => ({
    t,
    visits: groupedData[t],
  }));
}

// Helper to get client IP address
function getClientIp(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.connection.remoteAddress
  );
}
//   // Calculate the start date based on the period
//   const startDate = new Date(
//     currentDate.getTime() - (previousCount + nextCount + 1) * step
//   );

//   // Generate x-values for the previous days
//   for (let i = previousCount; i >= 0; i--) {
//     const timestamp = new Date(startDate.getTime() + step * i);
//     const x = formatDate(timestamp, format);
//     data.push({ x, y: 0 });
//   }

//   // Aggregate the actual data points
//   for (const pageView of pageViews) {
//     const timestamp = new Date(pageView.timestamp);
//     const x = formatDate(timestamp, format);

//     const existingData = data.find(item => item.x === x);
//     if (existingData) {
//       existingData.y++;
//     } else {
//       data.push({ x, y: 1 });
//     }
//   }

//   // Sort the data array by x-values in ascending order
//   data.sort((a, b) => new Date(a.x) - new Date(b.x));

//   return data;
// }

// function formatDate(date, format) {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const day = String(date.getDate()).padStart(2, "0");
//   const hours = String(date.getHours()).padStart(2, "0");
//   const minutes = String(date.getMinutes()).padStart(2, "0");

//   return format
//     .replace("yyyy", year)
//     .replace("MM", month)
//     .replace("dd", day)
//     .replace("HH", hours)
//     .replace("mm", minutes);
// }
