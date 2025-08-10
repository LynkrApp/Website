import type { NextApiRequest, NextApiResponse } from 'next';

type InstatusSummary = {
  page: {
    name: string;
    url: string;
    status: string; // e.g., "UP"
  };
  activeIncidents: Array<{
    id: string;
    name: string;
    started: string;
    status: string; // e.g., INVESTIGATING
    impact?: string; // e.g., MAJOROUTAGE, PARTIALOUTAGE, DEGRADED
    url?: string;
    updatedAt?: string;
  }>;
  activeMaintenances: Array<{
    id: string;
    name: string;
    start: string;
    status: string; // e.g., INPROGRESS, NOTSTARTEDYET
    duration?: string;
    url?: string;
    updatedAt?: string;
  }>;
};

type SimplifiedStatus = {
  label: string;
  state: 'up' | 'maintenance' | 'degraded' | 'partial' | 'major' | 'unknown';
  color: 'green' | 'blue' | 'yellow' | 'orange' | 'red' | 'gray';
  pageUrl: string;
  incidents: number;
  maintenances: number;
};

function mapImpactToState(impact?: string): SimplifiedStatus['state'] {
  const normalized = (impact || '').toUpperCase();
  if (normalized.includes('MAJOR')) return 'major';
  if (normalized.includes('PARTIAL')) return 'partial';
  if (normalized.includes('DEGRAD')) return 'degraded';
  if (normalized.includes('MINOR')) return 'degraded';
  return 'unknown';
}

function stateToColor(
  state: SimplifiedStatus['state']
): SimplifiedStatus['color'] {
  switch (state) {
    case 'up':
      return 'green';
    case 'maintenance':
      return 'blue';
    case 'degraded':
      return 'yellow';
    case 'partial':
      return 'orange';
    case 'major':
      return 'red';
    default:
      return 'gray';
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const response = await fetch('https://lynkr.instatus.com/summary.json', {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Lynkr-Website',
      },
      signal: controller.signal,
      // Force dynamic on Vercel edge if needed
      cache: 'no-store',
    });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Upstream error: ${response.status}`);
    }

    const data = (await response.json()) as InstatusSummary;

    const incidentsCount = data.activeIncidents?.length || 0;
    const maintCount = data.activeMaintenances?.length || 0;

    let state: SimplifiedStatus['state'] = 'unknown';
    let label = 'Status unavailable';

    if (incidentsCount > 0) {
      // Determine worst impact among incidents
      const impacts = data.activeIncidents.map((i) =>
        mapImpactToState(i.impact)
      );
      if (impacts.includes('major')) state = 'major';
      else if (impacts.includes('partial')) state = 'partial';
      else if (impacts.includes('degraded')) state = 'degraded';
      else state = 'degraded';
      label =
        incidentsCount === 1
          ? '1 active incident'
          : `${incidentsCount} active incidents`;
    } else if (maintCount > 0) {
      state = 'maintenance';
      label =
        maintCount === 1
          ? 'Maintenance in progress'
          : 'Multiple maintenances in progress';
    } else if (data.page?.status?.toUpperCase() === 'UP') {
      state = 'up';
      label = 'All systems operational';
    } else {
      state = 'unknown';
      label = 'Status unknown';
    }

    const simplified: SimplifiedStatus = {
      label,
      state,
      color: stateToColor(state),
      pageUrl: data.page?.url || 'https://lynkr.instatus.com',
      incidents: incidentsCount,
      maintenances: maintCount,
    };

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(200).json(simplified);
  } catch (error) {
    // Cache short to avoid thundering herd
    res.setHeader('Cache-Control', 's-maxage=30');
    return res.status(200).json({
      label: 'Status unavailable',
      state: 'unknown',
      color: 'gray',
      pageUrl: 'https://lynkr.instatus.com',
      incidents: 0,
      maintenances: 0,
    } satisfies SimplifiedStatus);
  }
}
