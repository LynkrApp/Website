import serverAuth from '@/lib/serverAuth';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.status(405).end();
    return;
  }

  try {
    const { currentUser } = await serverAuth(req, res);
    res.status(200).json(currentUser);
    return;
  } catch (error) {
    // Use 401 for unauthenticated to avoid confusion
    res.status(401).end();
    return;
  }
}
